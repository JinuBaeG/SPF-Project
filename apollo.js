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

const TOKEN = "token";
const PLATFORM = "platform";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const onPressGoogleBtn = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken } = await GoogleSignin.signIn();
  console.log("idToekn : ", idToken);
  if (idToken) {
    tokenVar(idToken);
  }
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const res = await auth().signInWithCredential(googleCredential);
  console.log(res);
};

export const signInWithKakao = async () => {
  try {
    const token = await login();
    const kakaoProfile = await getProfile();
    AsyncStorage.setItem(TOKEN, JSON.stringify(token));
    AsyncStorage.setItem(PLATFORM, "kakao");
    isLoggedInVar(true);
    tokenVar(JSON.stringify(token));
    console.log(JSON.stringify(token));
    console.log(kakaoProfile);
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
  uri: "http://172.30.1.20:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "http://172.30.1.20:4000/graphql",
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
