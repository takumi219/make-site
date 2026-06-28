import { createDefaultProps, getMvHeroInnerHTML } from '../builder/utils';

const MV_VARIANT_COUNT = 110;

export default function MvHeroShowcase() {
    const baseProps = createDefaultProps('mv-hero');

    return (
        <div className="wrapper mv-showcase">
            {Array.from({ length: MV_VARIANT_COUNT }, (_, i) => {
                const variant = `pt${i + 1}`;
                const html = getMvHeroInnerHTML({ ...baseProps, variant });
                return (
                    <div
                        key={variant}
                        className="mv-showcase-item"
                        data-variant={variant}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                );
            })}
        </div>
    );
}
