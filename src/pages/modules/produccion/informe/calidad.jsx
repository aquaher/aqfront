import { Paper, Stack, Typography, TextField, Select, MenuItem, Button } from "@mui/material";
import { selectTank } from "@/reducer/tank";
import { Repeat } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { getParameters } from "@/api/parameters";
import { DataGrid, GridActionsCellItem, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { AlertSwal } from "@/service/sweetAlert";
import CcIndex from "@/components/calidad/CcIndex";


export default function PiCalidad() {
    return(<CcIndex/>);
}
