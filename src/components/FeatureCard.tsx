type FeatureCardProps = {
  title: string;
  description: string;
};

const FeatureCard = (props: FeatureCardProps) => (
  <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20">
    <h3 className="text-xl font-semibold text-white">{props.title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-300">{props.description}</p>
  </article>
);

export { FeatureCard };
