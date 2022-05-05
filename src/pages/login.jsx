import { useState } from 'react'
import { LoginForm, LoginPage, LoginMainFooterBandItem } from '@patternfly/react-core'
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import img from '@/assets/img/b.png'
import logo from '@/assets/img/g_heredia.png'
import "@patternfly/react-core/dist/styles/base.css";
import { useAuth } from '@/auth/AuthProvider';
import { AlertSwal } from '@/service/sweetAlert';
function Login() {
  const { signIn, error, session } = useAuth();
  const [validate, setValidate] = useState({
    isValidUsername: true,
    isValidPassword: true,
    isRememberMeChecked: false,
    showHelperText: false,
    helperText: ''
  })
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  function recuerdame(e) { }
  async function login(e) {
    e.preventDefault();
    AlertSwal.fire({
      title: '¡Iniciando sesión!',
      timer: 3600,
      timerProgressBar: true,
      didOpen: async () => {
        AlertSwal.showLoading();
        await signIn(username, password);
        if (error) {
          AlertSwal.close()
        }
      },
    }).then(result => {
      if (!session) {
        AlertSwal.fire({
          title: 'Lo Ocurrio un error',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      }
    })
  }
  function handleChangeUsername(e) {
    setUsername(e)
  }
  function handleChangePassword(e) {
    setPassword(e)
  }
  const Formulario = (
    <LoginForm
      showHelperText={validate.showHelperText}
      helperText={validate.helperText}
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Nombre de usuario"
      usernameValue={username}
      onChangeUsername={handleChangeUsername}
      isValidUsername={validate.isValidUsername}
      passwordLabel="Contraseña"
      passwordValue={password}
      onChangePassword={handleChangePassword}
      isValidPassword={validate.isValidPassword}
      rememberMeLabel="Recuerdame."
      isRememberMeChecked={validate.isRememberMeChecked}
      onChangeRememberMe={e => setValidate({ ...validate, isRememberMeChecked: e })}
      onLoginButtonClick={login}
      loginButtonLabel="Iniciar sesion"
    />
  );
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
        {Formulario}
      </LoginPage>
    </>
  )
}

export default Login;
