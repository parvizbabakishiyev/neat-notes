import UpdateUser from '../features/user/UpdateUser';
import ChangePassword from '../features/auth/ChangePassword';
import DeleteAccount from '../features/user/DeleteAccount';

export default function Profile() {
  return (
    <div className="xxs:p-10 grid grid-cols-1 grid-rows-[2.5rem_1fr] items-center justify-items-center gap-5 p-4 lg:px-20">
      <h1 className="justify-self-start text-xl font-semibold text-neutral-800 dark:text-neutral-300">
        Account settings
      </h1>
      <div className="grid grid-cols-1 justify-center gap-6 md:gap-10 2xl:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-4 pb-4 dark:border-neutral-600 lg:p-10">
          <UpdateUser />
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 pb-4 dark:border-neutral-600 lg:p-10">
          <ChangePassword />
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-600 lg:p-10">
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
