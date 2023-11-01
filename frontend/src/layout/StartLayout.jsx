import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from '../layout/Footer';
import StartIllustration from '../ui/StartIllustration';
import { useAuthContext } from '../features/auth/AuthContextProvider';
import Modal from '../ui/Modal';
import { useLocalStorageState } from '../hooks/useLocaleStorage';
import Confirmation from '../ui/Confirmation';

export default function StartLayout() {
  const { isAuthenticated: isAuth } = useAuthContext();
  const [isDisclaimerAgreed, setIsDisclaimerAgreed] = useLocalStorageState('isDisclaimerAgreed', false);

  const agreeDisclaimer = () => setIsDisclaimerAgreed(true);

  if (isAuth) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="grid h-[var(--vh)] grid-cols-1 grid-rows-[1fr] md:grid-cols-[1fr_1fr]">
      <div className="grid h-[var(--vh)] grid-cols-1 grid-rows-[3rem_1fr_2rem] items-center bg-white dark:bg-neutral-900 sm:grid-rows-[4rem_1fr_2rem]">
        <Header isAuth={isAuth} />
        <Outlet />
        <Footer className="justify-center self-end md:justify-start md:pl-10" />
      </div>
      <StartIllustration className="hidden md:grid" />
      <Modal isOpen={!isDisclaimerAgreed} onClose={() => {}}>
        <Confirmation
          textHeading="Important Disclaimer"
          textConfirm="This web application is for testing purposes only. Please do not enter any private information. Data entered is not secure and may be accessible by others. Thank you for your understanding."
          textBtnConfirm="Accept and proceed"
          onConfirm={agreeDisclaimer}
        ></Confirmation>
      </Modal>
    </div>
  );
}
