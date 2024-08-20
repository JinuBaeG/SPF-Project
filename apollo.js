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
import { OPER_URL, LOCAL_URL } from "@env";
import { Platform } from "react-native";

const TOKEN = "token";

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
  const { idToken: token } = await GoogleSignin.signIn();

  const googleCredential = auth.GoogleAuthProvider.credential(token);
  const res = await auth().signInWithCredential(googleCredential);
  const { email, uid } = res.user;

  return { email, uid, token };
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
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};

//uri: "http://172.30.1.20:4000/graphql",
//uri: "http://ec2-13-125-37-103.ap-northeast-2.compute.amazonaws.com:4000/graphql"

const uploadHttpLink = createUploadLink({
  uri:
    process.env.NODE_ENV === "development"
      ? Platform.OS === "ios"
        ? `${LOCAL_URL}:4000/graphql`
        : "http://10.44.100.43:4000/graphql"
      : `${OPER_URL}:4000/graphql`,
});

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "development"
      ? Platform.OS === "ios"
        ? `${LOCAL_URL}:4000/graphql`
        : "http://10.44.100.43:4000/graphql"
      : `${OPER_URL}:4000/graphql`,
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
      keyFields: (obj) => `User:${obj.id}`,
      fields: {
        blockedBy: {
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
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
