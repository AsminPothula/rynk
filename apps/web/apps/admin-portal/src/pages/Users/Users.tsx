import PageTitle from '@shared/components/common/page-title';
import { Button } from '@shared/components/ui/button';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { PleaseWaitLoadText } from '@/components/please-wait-load-text';
import { UserCard } from '@shared/components/common/user-card';
import { UsersUIState } from './UsersUIState';

export function Users() {
  const { t } = useLanguageTranslation();
  const {
    users,
    infiniteRef,
    loadingText,
    fetchingOrLoading,
    hasNextPage,
    isButtonDisabled,
    fetchNextPage,
  } = UsersUIState();

  const userCards = users?.pages.map(({ users, otherInfo }, i) =>
    users.map((u) => <UserCard key={i + otherInfo + u.email} u={u} />),
  );

  return (
    <div className="flex h-full max-h-[100%] w-full flex-col gap-5">
      <PageTitle title={t('USERS.TITLE')} />
      <Button disabled={isButtonDisabled} onClick={() => fetchNextPage()}>
        {fetchingOrLoading ? (
          <PleaseWaitLoadText />
        ) : hasNextPage ? (
          t('USERS.FETCH_NEXT_PAGE')
        ) : (
          t('USERS.NO_MORE')
        )}
      </Button>
      <ScrollArea className="flex-1">
        <div className="flex w-full flex-col items-center justify-center gap-5">
          {userCards}
          <span ref={infiniteRef}>{loadingText}</span>
        </div>
      </ScrollArea>
    </div>
  );
}
