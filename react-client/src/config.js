const myAppConfig = {
    aws_appsync_graphqlEndpoint: "https://gfj2klqt45g2jbprcbhaxlcxky.appsync-api.us-east-1.amazonaws.com/graphql", // Add AppSync API Url here
    aws_appsync_region: "us-east-1", // Add Region where AppSync API is deployed
    aws_appsync_authenticationType: "API_KEY", // needs to remain as is
    aws_appsync_apiKey: "da2-hud2fqd6mrfankt6xga5zyzk54", // Add AppSync Api Key here
};

module.exports = {
    myAppConfig
};