import { useState } from 'react'
import { LoginForm, LoginPage, LoginMainFooterBandItem } from '@patternfly/react-core'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import img from '@/assets/img/b.png'
import logo from '@/assets/img/g_heredia.png'
import "@patternfly/react-core/dist/styles/base.css";
import { useAuth } from '@/auth/AuthProvider';
import { AlertSwal } from '@/service/sweetAlert';
import Swal from 'sweetalert2';
function App() {
  const { signIn, error } = useAuth();
  const [validate, setValidate] = useState({
    isValidUsername: true,
    isValidPassword: true,
    isRememberMeChecked: false,
    showHelperText: false,
    helperText: ''
  })
  const [form, setForm] = useState({
    username: 'o12345',
    password: '123'
  })
  function recuerdame(e) { }
  async function login(e) {
    e.preventDefault();
    AlertSwal.fire({
      title: '¡Iniciando sesión!',
      timer:3600,
      timerProgressBar: true,
      didOpen: async () => {
        AlertSwal.showLoading();
        await signIn(form.username, form.password);
        if(error){
          AlertSwal.close()
        }
      },
    }).then(result => {
      AlertSwal.fire({
        title: 'Lo sentimos el usuario o contraseña estan incorrectos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
    })
  }
  const Formulario = () => {
    return (
      <LoginForm
        showHelperText={validate.showHelperText}
        helperText={validate.helperText}
        helperTextIcon={<ExclamationCircleIcon />}
        usernameLabel="Nombre de usuario"
        usernameValue={form.username}
        onChangeUsername={e => setForm({ ...form, username: e })}
        isValidUsername={validate.isValidPassword}
        passwordLabel="Contraseña"
        passwordValue={form.password}
        onChangePassword={e => setForm({ ...form, password: e })}
        isValidPassword={validate.isValidPassword}
        rememberMeLabel="Recuerdame."
        isRememberMeChecked={validate.isRememberMeChecked}
        onChangeRememberMe={e => setValidate({ ...validate, isRememberMeChecked: e })}
        onLoginButtonClick={login}
        loginButtonLabel="Iniciar sesion"
      ></LoginForm>
    );
  }
  const forgotCredentials = (
    <LoginMainFooterBandItem>
      <a href="#">Perdiste la contraseña?</a>
    </LoginMainFooterBandItem>
  );
  return (
    <>
      <LoginPage
        footerListVariants="inline"
        brandImgSrc={logo}
        brandImgAlt="PatternFly logo"
        backgroundImgSrc={img}

        backgroundImgAlt="Images"
        textContent="Aplicacion para usuarios pertenecientes al grupo heredia"
        loginTitle="Inicia sesión con tu cuenta"
        loginSubtitle="Ingresa aqui tus credenciales"
        forgotCredentials={forgotCredentials}
      >
        <Formulario />
      </LoginPage>
    </>
  )
}

export default App
