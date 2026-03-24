type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

const SectionTitle = (props: SectionTitleProps) => (
  <div className="max-w-2xl">
    {props.eyebrow ? (
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
        {props.eyebrow}
      </p>
    ) : null}
    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      {props.title}
    </h2>
    {props.description ? (
      <p className="mt-4 text-base leading-7 text-slate-300">
        {props.description}
      </p>
    ) : null}
  </div>
);

export { SectionTitle };
