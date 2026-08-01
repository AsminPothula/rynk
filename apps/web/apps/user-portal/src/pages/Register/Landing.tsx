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
import ExampleDemo from '@/components/example-demo';
import { Button } from '@shared/components/ui/button';

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
          </CardDescription>

          <CardContent className="mt-2 text-center">
            <h1 className="text-6xl font-bold capitalize">
              {envName} {t('LANDING.PORTAL')}
            </h1>
          </CardContent>

          <CardFooter className="mt-8 flex flex-col justify-center space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                navigate(NavigationRoutes.SignIn);
              }}>
              {t('LANDING.GET_STARTED')}
            </Button>

            <ExampleDemo />
          </CardFooter>
        </BackgroundGradient>
      </Card>
    </div>
  );
}
