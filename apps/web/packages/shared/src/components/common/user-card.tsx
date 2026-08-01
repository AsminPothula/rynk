import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import type { GetProfileResponse } from '../../_api';

export function UserCard(props: { u: GetProfileResponse }) {
  const initials = `${props.u?.firstName?.[0] ?? ''}${props.u?.lastName?.[0] ?? ''}`;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className="w-full p-5 sm:w-[350px] md:w-[500px]">
        <CardContent>
          <Avatar className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 object-cover">
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="mt-2">
            <p className="text-l font-bold">
              {props.u?.firstName} {props.u?.lastName}
            </p>
            <p className="text-md text-gray-400">{props.u?.email} </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
