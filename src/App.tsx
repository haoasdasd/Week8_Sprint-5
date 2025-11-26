import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Fragment } from 'react/jsx-runtime'
import AppRouter from './app/routes/app-route'
import PopupConfirm from '~/app/components/popup-confirm-component'

export default function App() {
    const routes = AppRouter()

    return (
        <Fragment>
            {routes}
            <ToastContainer
                position='top-center'
                transition={Flip}
                hideProgressBar={true}
                autoClose={1000}
                style={{ zIndex: 9999999999999 }}
            />
            <PopupConfirm />
        </Fragment>
    )
}
