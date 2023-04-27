query = """
    mutation publishData($channelName: String!, $testData: AWSJSON!){
        publish(name:$channelName, data: $testData) {
            data
            name
        }
    }
"""
