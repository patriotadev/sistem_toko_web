import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../stores/hooks";
import AuthModule from "../../modules/auth/auth";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import LoadingIcon from "../../base-components/LoadingIcon";

type LoginInputs = {
  email: string,
  password: string
}
 
function Main() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginInputs>();
  
  const onSubmit: SubmitHandler<LoginInputs> = (data, event) => {
    setIsLoading(true)
    event?.preventDefault();
    AuthModule.login(data)
    .then(res => res.json())
    .then(result => {
      if (result.code === 200) {
        Cookies.set('accessToken', result.data.accessToken, {expires: new Date(new Date().getTime() + 15 * 60 * 1000)});
        Cookies.set('refreshToken', result.data.refreshToken, {expires: 7});
        navigate('/');
      } else {
        toast.error(result.error);
      }
    }).finally(() => setIsLoading(false));
  };

  return (
    <>
      <Toaster/>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
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
                <span className="ml-3 text-lg text-white"> Sistem Toko </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  Login ke akun Anda <br />
                  dengan mudah dan cepat
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  {/* Manage all your e-commerce accounts in one place */}
                  Kelola semua data penjualan dengan satu aplikasi
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
                  A few more clicks to sign in to your account. Manage all your
                  e-commerce accounts in one place
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
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                    placeholder="Password"
                  />
                  {errors.password && <div className="mt-2 text-danger">
                    {errors.password.message}
                  </div>}
                </div>
                <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                  <div className="flex items-center mr-auto">
                    <FormCheck.Input
                      id="remember-me"
                      type="checkbox"
                      className="mr-2 border"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      Ingat saya
                    </label>
                  </div>
                  <a href="">Lupa Password?</a>
                </div>
                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button
                    disabled={isLoading}
                    type="submit"
                    variant="primary"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                  >
                    Login
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
