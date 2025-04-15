import { ChangeEvent, useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { IEmpleado, IEmpleadoN } from "../Interfaces/IEmpleado"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap"

const initialEmpleado = {
    idEmpleado: 0,
    nombre: "",
    correo: "",
    sueldo:0
}

export function EditarEmpleado(){

    const {id} = useParams<{id:string}>()
    const [empleado, setEmpleado] = useState<IEmpleadoN>(initialEmpleado)
    const navigate = useNavigate()

    useEffect(() => {
        const obtenerEmpleado = async() => {
            const response = await fetch(`${appsettings.apiUrl}Empleado/Obtener/${id}`)

            if(response.ok){
                const data = await response.json()
                setEmpleado(data)
            }
        }

        obtenerEmpleado()

    },[])

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name
        const inputValue = event.target.value

        setEmpleado({ ...empleado, [inputName] : inputValue })
    }

    const guardar = async() => {
        try{
            const response = await fetch(`${appsettings.apiUrl}Empleado/Editar`, {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(empleado)
            })
            if(response.ok){
                navigate("/") 
            }else{
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "No se pudo editar el empleado",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }catch{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo guardar el empleado",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }    
            
    }

    const volver = () => {
        navigate("/")
    }

    return(
        <Container className="mt-5">
            <Row>
                <Col sm={{size:8, offset:2}}>
                    <h4>Editar Empleado</h4>
                    <hr/>
                    <Form className="mb-4">
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="nombre" onChange={inputChangeValue} value={empleado.nombre}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Correo</Label>
                            <Input type="text" name="correo" onChange={inputChangeValue} value={empleado.correo}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Sueldo</Label>
                            <Input type="number" name="sueldo" onChange={inputChangeValue} value={empleado.sueldo}></Input>
                        </FormGroup>
                    </Form>
                    <Button color="primary" className="me-2" onClick={guardar} > Guardiar</Button>
                    <Button color="secondary" onClick={volver}> Volver</Button>

                </Col>
            </Row>
        </Container>
    )
}