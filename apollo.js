import { ApolloClient, InMemoryCache, makeVar, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { login, logout, getProfile } from "@react-native-seoul/kakao-login";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { appleAuth } from "@invertase/react-native-apple-authentication";

const TOKEN = "token";
const PLATFORM = "platform";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const onAppleButtonPress = async () => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user
  );

  if (credentialState === appleAuth.State.AUTHORIZED) {
    const { user: uid, identityToken: token } = appleAuthRequestResponse;

    return { uid, token };
  }
};

export const onPressGoogleBtn = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken } = await GoogleSignin.signIn();

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const res = await auth().signInWithCredential(googleCredential);
  const { email, uid } = res;

  return { email, uid, idToken: token };
};

export const signInWithKakao = async () => {
  try {
    const kakaoToken = await login();
    const kakaoProfile = await getProfile();
    const token = kakaoToken.accessToken;
    const { email, id: uid } = kakaoProfile;

    return { email, uid, token };
  } catch (err) {
    console.error("login err", err);
  }
};

export const signOutWithKakao = async () => {
  try {
    const message = await logout();
    await AsyncStorage.removeItem(TOKEN);
    await AsyncStorage.removeItem(PLATFORM);
    isLoggedInVar(false);
    tokenVar(null);
  } catch (err) {
    console.error("signOut error", err);
  }
};

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  await AsyncStorage.setItem(PLATFORM, "playinus");
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  await AsyncStorage.setItem(PLATFORM, "playinus");
  isLoggedInVar(false);
  tokenVar(null);
};

const uploadHttpLink = createUploadLink({
  uri: "http://ec2-3-36-68-172.ap-northeast-2.compute.amazonaws.com:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "http://ec2-3-36-68-172.ap-northeast-2.compute.amazonaws.com:4000/graphql",
  options: {
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`Graphql Error`, graphQLErrors);
  }
  if (networkError) {
    console.log(`NetWork Error`, networkError);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
        seeBoardComments: offsetLimitPagination(),
      },
    },
    User: {
      keyFields: (obj) => `User:${obj.username}`,
    },
    Message: {
      fields: {
        user: {
          merge: true,
        },
        feedCategory: {
          merge: true,
        },
      },
    },
  },
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
