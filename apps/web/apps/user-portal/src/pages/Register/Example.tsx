import { Button } from '@shared/components/ui/button';
import { ViteLogo } from '@shared/components/common/vite-logo';
import { envName } from '../../config/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@shared/components/ui/card';
import { NavigationRoutes } from '@/common/constant';
import { useNavigate } from 'react-router-dom';
import { BackgroundGradient } from '@shared/components/ui/background-gradient';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';

export function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();

  return (
    <div className="width-full flex h-screen flex-col items-center justify-center">
      <Card className="rounded-[22px]">
        <BackgroundGradient className="rounded-[22px] bg-white p-4 sm:p-10 dark:bg-zinc-900">
          <CardHeader className="align-center flex justify-center">
            <div className="align-center flex justify-center">
              <ViteLogo />
            </div>
          </CardHeader>

          <CardDescription className="mt-5 text-center text-2xl text-gray-500">
            {t('LANDING.WELCOME')}
            {/* {t('LANDING.asd')} */}
          </CardDescription>

          <CardContent className="mt-2 text-center">
            <h1 className="text-6xl font-bold capitalize">{envName} portal</h1>

            {/* <p className="mt-5 text-xl text-gray-500">Under Construction!!</p> */}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              className="mt-5"
              onClick={() => {
                navigate(NavigationRoutes.SignIn);
              }}>
              {t('LANDING.GET_STARTED')}
            </Button>
          </CardFooter>
        </BackgroundGradient>
      </Card>
    </div>
  );
}
