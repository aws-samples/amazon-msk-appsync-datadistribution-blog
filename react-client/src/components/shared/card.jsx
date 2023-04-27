import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

export default function BasicCard(props) {
  const {data} = props;
  const firstHalfValue = data.slice(0,3);
  const secondHalfValue = data.slice(3);
  return (
    <Card sx={{ minWidth: 275, maxWidth:'250px', padding:'0.1rem' , background:'linear-gradient(to right, rgb(255 251 251 / 73%), rgb(221 224 226))'}}>
      <CardContent sx={{alignContent:"center",  }}>
        <Typography sx={{ fontSize: 14, paddingBottom:3 }} gutterBottom>
          {props.title}
        </Typography>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1}>
          {firstHalfValue.map((val)=>{
            return (
              <div>
                <Chip label={val} variant="outlined" color="primary"/>
              </div>
            )
          })}
          </Stack>
          <Stack direction="row" spacing={1}>
          {secondHalfValue.map((val)=>{
            return (
              <div>
                <Chip label={val} variant="outlined" color="primary"/>
              </div>
            )
          })}
          </Stack>
        </Stack>
        {/* <BasicChips data={props.data}/> */}
      </CardContent>
    </Card>
  );
}
