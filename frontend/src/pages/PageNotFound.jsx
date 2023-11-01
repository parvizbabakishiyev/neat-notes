import Button from '../ui/Button';
import Logo from '../ui/Logo';

export default function NotFound() {
  return (
    <div className="flex h-[var(--vh)] flex-col items-center justify-start gap-10 bg-white pt-[20vh] dark:bg-neutral-800">
      <Logo />
      <div className="text-neutral-800 dark:text-neutral-300">
        Page not found,&nbsp;
        <Button isLink={true} to="/" btnType="link">
          Go back
        </Button>
      </div>
    </div>
  );
}
