import { volumen } from "@/api/volumen";
import { selectTank } from "@/reducer/tank";
import colorsGenerator from "@/service/colors";
import { Stack,Paper, Skeleton, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import useSWR from "swr";

const CardVold=({tank})=>{
    const {data,error} = useSWR({url:'/last',data:{params:{tankId:tank.id}}},volumen.getBy);
    if(error) return <Stack>Lo sentimos ocurrion un error</Stack>
    if(!data) return <Skeleton/>;
    return(
        <Paper elevation={10} sx={{p:2,height:110,bgcolor:colorsGenerator.hexLight()}}>
            <Stack spacing={1} alignItems='center'>
                <Typography fontSize={16} fontWeight='bold'>VOLUMEN DE {tank.name} - {tank.water}</Typography>
                <Typography fontSize={24} fontWeight='bold'>{data.vol}</Typography>
            </Stack>
        </Paper>
    );
}
export default function CvVolumen(){
    
    const {value} = useSelector(selectTank);
    
    if(!value) return <Skeleton/>
    return(
        <Stack spacing={1}>
            <Stack alignItems='center'>
                <Typography fontSize={20} fontWeight='bold'>Volumenes de agua {new Date().toLocaleDateString()}</Typography>
            </Stack>
            <Grid container spacing={1} columns={{ xs: 4, sm: 12, md: 12 }}>
            {value.map((el,idx)=>
            (
                <Grid item xs={4} sm={6} md={3} key={idx}>
                    <CardVold tank={el} />
                </Grid>
                
            ))}
        </Grid>
        </Stack>
    );
}