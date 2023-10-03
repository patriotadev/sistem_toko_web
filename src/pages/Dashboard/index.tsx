import Alert from '../../base-components/Alert';

function Main() {
  

  return (
    <>
      <div className="grid grid-cols-12 gap-6 intro-y">
        <div className="col-span-12 2xl:col-span-12 mt-10">
          <Alert variant='primary'>
            Selamat datang! 👋
          </Alert>
        </div>
      </div>
    </>
  );
}

export default Main;
