import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import moment from "moment";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import loginIllustration from "../../assets/images/stock-exchange.png";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../stores/hooks";
import AuthModule from "../../modules/auth/auth";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import LoadingIcon from "../../base-components/LoadingIcon";
import { AxiosError, AxiosResponse } from "axios";

type LoginInputs = {
  email: string,
  password: string
}
 
function Main() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginInputs>();
  
  const onSubmit: SubmitHandler<LoginInputs> = (data, e) => {
    console.log(e)
    e?.preventDefault();
    setIsLoading(true)  
    AuthModule.login(data).then((res: AxiosResponse) => {
      console.log(res.status);
      const result = res.data;
      Cookies.set('accessToken', result.data.accessToken, {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
      Cookies.set('isTokenExpired', result.data.accessToken, {expires: Number((1 / 1440) * 10 )});
      Cookies.set('role', JSON.stringify(result.data.role), {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
      Cookies.set('toko', JSON.stringify(result.data.toko), {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
      Cookies.set('paymentAccount', JSON.stringify(result.data.paymentAccount), {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
      Cookies.set('userRoleMenu', JSON.stringify(result.data.userRoleMenu), {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
      Cookies.set('refreshToken', result.data.refreshToken, {expires: Number(import.meta.env.VITE_APP_REFRESH_TOKEN_TIME)});
      window.location.href = "/";
    }).catch((e: AxiosError) => {
        const errResponse = e?.response?.data as {[key: string]: string};
        setTimeout(() => {
          setIsLoading(false);
          toast.error(errResponse.error);
        }, 2000);
    })
  };

  return (
    <>
      <Toaster/>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700 overflow-x-hidden",
        ])}
      >
        <DarkModeSwitcher />
        {/* <MainColorSwitcher /> */}
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="ml-3 text-lg text-white"> TB. HIDUP BARU </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-1/2 -mt-16 -intro-x"
                  src={loginIllustration}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  Login ke akun Anda <br />
                  dengan mudah dan cepat
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  {/* Manage all your e-commerce accounts in one place */}
                  Kelola semua data toko dengan satu aplikasi
                </div>
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Login
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                  Sistem Informasi Manajemen TB. Hidup Baru
                  {/* Login ke akun Anda dengan mudah dan cepat. Kelola semua data toko dengan satu aplikasi */}
                </div>
                <div className="mt-8 intro-x">
                  <FormInput
                    {...register("email", {required: 'Email tidak boleh kosong'})}
                    type="text"
                    className={`${errors.email && "border-danger"} block px-4 py-3 intro-x min-w-full xl:min-w-[350px]`}
                    placeholder="Email"
                  />
                  {errors.email && <div className="mt-2 text-danger">
                    {errors.email.message}
                  </div>}
                  
                  <FormInput
                    {...register("password", {required: 'Password tidak boleh kosong'})}
                    type="password"
                    className={`${errors.password && "border-danger"} block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]`}
                    placeholder="Password"
                  />
                  {errors.password && <div className="mt-2 text-danger">
                    {errors.password.message}
                  </div>}
                </div>
                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button
                    disabled={isLoading}
                    type="submit"
                    variant="primary"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                  >
                    {isLoading ? 'Loading' : 'Login' }
                    {isLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
                </form>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
