import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
import { useTheme } from "@mui/material";

export default function BarChart() {
  const theme = useTheme(); const [rows,setRows] = useState([]); const [loading,setLoading] = useState(true); const [error,setError] = useState("");
  useEffect(()=>{let active=true; axios.get("/api/v1/count-doc",{withCredentials:true}).then(({data})=>{const d=data?.data||{};if(active)setRows([{category:"Faculty",total:Number(d.teachers)||0},{category:"Students",total:Number(d.students)||0},{category:"Courses",total:Number(d.courses)||0},{category:"Subjects",total:Number(d.subjects)||0}]);}).catch(()=>{if(active)setError("Campus totals could not be loaded. Sign in and try again.");}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
  return <Box sx={{width:"100%",p:{xs:1,sm:2}}}><Typography variant="h4" fontWeight={700}>Campus records</Typography><Typography color="text.secondary" sx={{mt:1,mb:2}}>Compare current counts across academic records.</Typography>{error&&<Alert severity="warning" sx={{mb:2}}>{error}</Alert>}{loading?<CircularProgress/>:<Box sx={{height:420,width:"100%"}}><ResponsiveBar data={rows} keys={["total"]} indexBy="category" margin={{top:20,right:24,bottom:50,left:60}} padding={0.35} valueScale={{type:"linear"}} indexScale={{type:"band",round:true}} colors={{scheme:"paired"}} borderRadius={4} axisBottom={{tickSize:0,tickPadding:12}} axisLeft={{tickSize:0,tickPadding:8}} enableLabel={true} labelSkipWidth={16} labelSkipHeight={16} theme={{textColor:theme.palette.text.primary,axis:{domain:{line:{stroke:theme.palette.divider}},ticks:{text:{fill:theme.palette.text.secondary}}},grid:{line:{stroke:theme.palette.divider}}}} role="img" ariaLabel="Bar chart comparing campus record totals"/></Box>}</Box>;
}
