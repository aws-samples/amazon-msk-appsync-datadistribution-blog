import React from 'react';
import Amplify, { API, graphqlOperation } from "aws-amplify";

import "./App.css";
import { channelData, defualtValues } from './constants';
import { myAppConfig } from './config';
import * as subscriptions from "./graphql/subscriptions"; //codegen generated code

import Navbar from "./components/navbar/navbar"
import {
    Grid,
    Divider,
    Typography,
    Card,
    CardContent,
} from "@mui/material";

import SimpleAccordion from "./components/shared/customAccordin";
import CustomCard from "./components/shared/card";

const appConfig = {
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_URL,
    aws_appsync_region: "us-east-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.REACT_APP_APPSYNC_API_KEY,
}

Amplify.configure(appConfig);


const testVal = {...defualtValues};
testVal.Close = 95.98999786376953;
testVal.Volume = 9000;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      channels: [channelData.TESlA.name, channelData.AMAZON.name],
      teslaData: [defualtValues, testVal, defualtValues, testVal, defualtValues, testVal],
      amazonData: [defualtValues, testVal, defualtValues, testVal, defualtValues, testVal],
      value: '',
      subscription: {},
    };
  }

  componentDidMount() {
    // Subscribe to changes
    
    const channels = [channelData.TESlA.name, channelData.AMAZON.name]
    this.subscribe(channels);
  }
  
  componentWillUnmount() {
    // Uncomment Code to unsubscribe
    // return () => this.state.subscription.unsubscribe();
  }
  
  spliceIntoChunks(arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
  }

  subscribe(filterData) {
    const filterChunks = this.spliceIntoChunks(filterData, 5);
    const filterExpression = {or:[]}; 
    filterChunks.map((filterValues)=>{
      filterExpression.or.push({name: { in: filterValues }});
    })
    const subscription = API.graphql(
      graphqlOperation(subscriptions.subscribe, { filter: JSON.stringify(filterExpression)})
    ).subscribe({
      next: ({ provider, value }) => {
        if(value){
          this.updateData(JSON.parse(value.data.subscribe.data));
        }
      },
      error: (error) => {
        console.log("Error", error);
      }
    });

    this.setState({
      subscription: subscription
    });

  }

  updateData(data) {
    let {topic, value} = data;
    value = JSON.parse(value);
    
    switch (topic) {
      case channelData.TESlA.name:
        const teslaState = this.state.teslaData;
        teslaState.unshift(value);
        teslaState.pop();
        this.setState({
          teslaData: teslaState
        });
        break;
      case channelData.AMAZON.name:
        const amazonState = this.state.amazonData;
        amazonState.unshift(value);
        amazonState.pop();
        this.setState({
          amazonData: amazonState
        });
        break;
      default:
        break;
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="App">
        {/* add nav component and main body component  */}
        <div style={{ height: "100vh", width: "100wv" }}>
          <Navbar />
          <Divider light />
          <Grid
              container
              spacing={1}
              marginTop={0.05}
              id={"divider-svg"}
              minHeight={"45rem"}
          >
              <Grid Box xs={8} lg={8} md={8}>
                  <Grid
                      Box
                      xs={9}

                      sx={{padding:'2rem'}}
                  >
                      <Typography
                          variant="h4"
                          component={"h4"}
                          sx={{ padding:'0px 24px' }}
                      >
                          Stock Market Overview  
                      </Typography>
                  </Grid>
                  <Grid Box xs={10} sx={{ padding: "2rem" }}>
                      <Typography
                          variant="body"
                          component={"p"}
                          sx={{  padding:'1rem 1.65rem' }}
                      >
                        Get the latest stock market news, stock information & quotes, data analysis reports, as well as a general overview of the market landscape.
                      </Typography>
                  </Grid>

                  <Grid Card sx={{ padding: "1rem 3.7rem", paddingRight:'0px' }}>
                        <Card>
                          <CardContent>
                              <SimpleAccordion data={this.state.amazonData} channel={channelData.AMAZON}/>
                              <SimpleAccordion data={this.state.teslaData} channel={channelData.TESlA}/>
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>

              <Grid Box xs={8} md={4} align={"left"}>
                <Grid Container sx={{  padding:'2rem'}}>
                  <Grid Box sx={{paddingTop:'15%'}}>
                      <Grid Card sx={{ padding: "1rem 3.7rem", paddingRight:'0px', display:"flex", justifyContent:'center'  }}>
                        <CustomCard  title="Most viewed stocks" data={["AMZN","TSLA","MSFT","KO","AAPl","META"]}  style={{}}/>
                      </Grid>
                      <Grid Card sx={{ padding: "1rem 3.7rem", paddingRight:'0px' , display:"flex", justifyContent:'center', flexGrow:'1' }}>
                        <CustomCard  title="Market trends" data={["Market index","Active","Gainer","Loser","Crypto"]} />
                      </Grid>
                      <Grid Card sx={{ padding: "1rem 3.7rem", paddingRight:'0px' , display:"flex", justifyContent:'center'}}>
                        <CustomCard  title="Gainers" data={["AMZN","TSLA","MSFT","KO","AAPl","META"]} />
                      </Grid>
                  </Grid>

                </Grid>
              </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
export default App;



