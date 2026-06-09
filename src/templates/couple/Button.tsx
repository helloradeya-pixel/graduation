import classNames from 'classnames';

type IButtonProps = {
  xl?: boolean;
  children: React.ReactNode;
};

const Button = (props: IButtonProps) => {
  const btnClass = classNames(
    'btn',
    props.xl ? 'btn-xl' : 'btn-base',
    'btn-primary'
  );

  return (
    <button className={btnClass}>
      {props.children}

      <style jsx>{`
        .btn {
          @apply inline-block rounded-md text-center;
        }

        .btn-base {
          @apply text-lg font-semibold py-2 px-4;
        }

        .btn-xl {
          @apply font-semibold text-xl py-2 px-5;
        }

        .btn-primary {
          @apply text-white bg-[#C8A96A] hover:bg-[#b89655];
        }
      `}</style>
    </button>
  );
};

export { Button };
