import PageTitle from '../components/common/page-title';
import { ConfirmActionAlert } from '../components/common/confirm-action-alert';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { NavigationRoutes } from '../common/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../state/useAuthStore';
import { useProfile } from '../hooks/rq/queries/useProfile';

interface SettingsPageProps {
  t: (key: string) => string;
  showDeleteAccount?: boolean;
}

export function Settings({ t, showDeleteAccount = true }: SettingsPageProps) {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  const logout = () => {
    useAuthStore.getState().logout();
    toast.success(t('DIALOG.LOGOUT.TOAST.SUCCESS'));
    navigate(NavigationRoutes.Landing);
  };

  const deleteAccount = () => {
    toast.success(t('DIALOG.ACCOUNT_DELETE.TOAST.SUCCESS'));
    logout();
  };

  const initials =
    (profile?.firstName?.[0] || '') + (profile?.lastName?.[0] || '');

  return (
    <div className="flex w-full flex-col gap-5">
      <PageTitle title={t('SETTINGS.TITLE')} />

      <div className="flex w-full flex-col items-start gap-5">
        <Card className="px-5 py-2">
          <CardHeader>
            <CardTitle className="text-2xl">{t('SETTINGS.PROFILE')}</CardTitle>
          </CardHeader>

          <CardContent className="w-[300px]">
            <Avatar className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 object-cover">
              <AvatarFallback className="rounded-full text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="mt-2">
              <p className="text-l font-bold">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-md text-gray-400">{profile?.email} </p>

              {isLoading ? (
                <>
                  <Skeleton className="mt-4 h-4 w-[200px]" />
                  <Skeleton className="mt-2 h-4 w-[250px]" />{' '}
                </>
              ) : null}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start">
            {showDeleteAccount && (
              <ConfirmActionAlert
                triggerLabel={t('DIALOG.ACCOUNT_DELETE.PARENT_TRIGGER_BUTTON')}
                triggerVariant="link"
                triggerSize="sm"
                triggerClassName="my-3 pl-0 underline"
                title={t('DIALOG.ACCOUNT_DELETE.TITLE')}
                description={t('DIALOG.ACCOUNT_DELETE.DESCRIPTION')}
                cancelText={t('DIALOG.ACCOUNT_DELETE.CANCEL_ACTION')}
                confirmText={t('DIALOG.ACCOUNT_DELETE.DELETE_ACTION')}
                onConfirm={deleteAccount}
              />
            )}
            <ConfirmActionAlert
              triggerLabel={t('DIALOG.LOGOUT.PARENT_TRIGGER_BUTTON')}
              title={t('DIALOG.LOGOUT.TITLE')}
              description={t('DIALOG.LOGOUT.DESCRIPTION')}
              cancelText={t('DIALOG.LOGOUT.CANCEL_ACTION')}
              confirmText={t('DIALOG.LOGOUT.LOGOUT_ACTION')}
              onConfirm={logout}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
