import { selectTank } from "@/reducer/tank";
import { ContentCutOutlined, Repeat, SaveAsRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Paper, Stack, Typography, TextField, Box, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState } from "react";
import { useSelector } from "react-redux";
import { getParameters, putParameters, setParameters } from "@/api/parameters";
import { format } from "date-fns";
import { AlertSwal } from "@/service/sweetAlert";

export default function Pcparametros() {
    const { value } = useSelector(selectTank);
    const [optTank, setOptTank] = useState('TQ-1');
    const [date, setDate] = useState(new Date());
    const [isLoad, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [editabel, setEditable] = useState([]);
    async function loadParams(e) {
        setLoad(true)
        setData([])
        try {
            const tank_id = value.find(e => e.name == optTank).id;
            const getData = await getParameters({ date: format(date, 'yyyy-MM-dd'), tank_id: tank_id });
            if (getData.length == 0) {
                await dialog();
            } else {
                setData(getData)
            }
        } catch (error) {

        }
        setLoad(false)
    }
    async function dialog() {
        AlertSwal.fire({
            title: `¡Lo sentimos, no existen parametros de calidad ingresados en esta fecha!, ¿Deseas crear parametros para ${optTank}?`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            icon: 'question',
        }).then((res) => {
            if (res.isConfirmed) {
                var inp="";
                var fec=format(date, 'MM-dd-yyyy');
                var res = fec.replace(/-/g, '');
                const idtak=value.find(e => e.name == optTank).id;
                switch (idtak) {
                    case 1:
                        inp="AP01"+res;
                      break;
                    case 2:
                        inp="AP02"+res;
                      break;
                    case 3:
                        inp="AUF03"+res;
                      break;
                    case 4:
                        inp="A04"+res;
                      break;
                    case 5:
                        inp="AT05"+res;
                      break;
                    case 6:
                        inp="A06"+res;
                      break;
                  }
                
                AlertSwal.fire({
                    title: `Ingresa el número de lote para los parametros de ${optTank}?`,
                    showConfirmButton: true,
                    confirmButtonText: 'Crear',
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    icon: 'info',
                    input: 'text',
                    inputValue:inp ,
                    preConfirm: async (txt) => {
                        try {
                            if (!txt || txt.trim() === "") {
                                AlertSwal.showValidationMessage("Por favor ingrese el lote");
                            }else{
                                const tank_id = value.find(e => e.name == optTank).id;
                                // alert(tank_id);
                                const params = await setParameters({ tank_id: tank_id, lote: txt, date: format(date, 'yyyy-MM-dd') });
                                 setData(params)
                            }
                            
                        } catch (error) {
                            AlertSwal.showValidationMessage(
                                `${error}`
                            )
                        }
                    },
                    allowOutsideClick: () => !AlertSwal.isLoading()
                }).then(create => {
                    if (create.isConfirmed) {
                        AlertSwal.fire({
                            title: `Los parametros se crearon con éxito`,
                            icon: 'success'
                        })
                    }
                })
            }
        });
    }
    async function editParams(e) {

        if (data[0].quality.date >= format(date, 'yyyy-MM-dd')) {
            AlertSwal.fire({
                title: `¿Estas seguro que deseas registrar los parametros para ${optTank}?`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                icon: 'question',
                preConfirm: async () => {
                    try {
                        const params = await putParameters(data);
                        setData(params)
                    } catch (error) {
                        AlertSwal.showValidationMessage(
                            `${error}`
                        )
                    }
                },
                allowOutsideClick: () => !AlertSwal.isLoading()
            }).then((res) => {
                if (res.isConfirmed) {
                    AlertSwal.fire({
                        title: `Los parametros se resgistraron correctamente`,
                        icon: 'success'
                    })
                }
            });
        } else {
            AlertSwal.fire({
                title: `¡Lo sentimos, no puede editar estos parametros!`,
                icon: 'error'
            })
        }
    }
    return (
        <Stack spacing={2} alignItems='center'>
            <Paper sx={{ p: 2 }} elevation={10}>
                <Stack spacing={2}>
                    <Stack alignItems='center'>
                        <Typography fontWeight='bold' fontSize={20}>Registro de Parámetros de calidad del Agua</Typography>
                    </Stack>
                    <Typography fontWeight='bold'>Selecciona la fecha y tanque</Typography>

                    <DesktopDatePicker
                        label="Selecciona la fecha"
                        inputFormat="MM/dd/yyyy"
                        value={date}
                        onChange={e => setDate(e)}
                        renderInput={(params) => <TextField {...params} />}
                    />


                    <Select value={optTank} onChange={e => setOptTank(e.target.value)}>
                        {value ? value.map((tanque) => <MenuItem key={tanque.id} value={tanque.name}>{tanque.name} - {tanque.water}</MenuItem>) : null}
                    </Select>

                    <Stack alignItems='center'>
                        <LoadingButton
                            loading={isLoad}
                            startIcon={<Repeat />}
                            variant='contained'
                            color='primary'
                            onClick={loadParams}>Cargar Parametros</LoadingButton>
                    </Stack>
                </Stack>

            </Paper>
            {data.length != 0 ?
                <>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>PARAMETROS</TableCell>
                                    <TableCell>RESULTADO</TableCell>
                                    <TableCell>UNIDAD</TableCell>
                                    <TableCell>MÉTODO</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((param, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{param.method.name}</TableCell>
                                            <TableCell>
                                                <TextField value={param.result||''} onChange={(e) => {
                                                    param.result = e.target.value;
                                                    setData([...data])
                                                }}></TextField>
                                            </TableCell>
                                            <TableCell>{param.method.unit.symbol}</TableCell>
                                            <TableCell>{param.method.symbol}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack alignItems='center'>
                        <LoadingButton
                            loading={isLoad}
                            startIcon={<SaveAsRounded />}
                            variant='contained'
                            color='primary'
                            onClick={editParams}>Registrar</LoadingButton>
                    </Stack>
                </>
                : null}

        </Stack >
    );
}