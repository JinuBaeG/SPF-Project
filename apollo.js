import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context"
import { offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onError } from "@apollo/client/link/error";

const TOKEN = "token"

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token) => {
    await AsyncStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
    tokenVar(token);
}

export const logUserOut = async () => {
    await AsyncStorage.removeItem(TOKEN);
    isLoggedInVar(false);
    tokenVar(null);
}

const httpLink = createHttpLink({
    uri : "https://cold-phones-buy-14-36-162-26.loca.lt/graphql",
})

const uploadHttpLink = createHttpLink({
    uri : "https://cold-phones-buy-14-36-162-26.loca.lt/graphql",
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,            
            token : tokenVar()
        }
    }
})

const onErrorLink = onError(({graphQLErrors, networkError}) => {
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
                    seeFeed: offsetLimitPagination()
                }
            },
            User: {
                keyFields: (obj) => `User:${obj.username}`,
            }
        }
    })

const client = new ApolloClient({
    link: authLink.concat(onErrorLink).concat(uploadHttpLink),
    cache
})

export default client