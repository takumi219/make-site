import { H3_DESCRIPTIONS } from '../builder/componentMeta';
import { createDefaultProps, getH3SectionHTML } from '../builder/utils';

export default function H3SectionShowcase() {
    const baseProps = createDefaultProps('h3-section');

    return (
        <>
            {Object.keys(H3_DESCRIPTIONS).map((variant) => (
                <div
                    key={variant}
                    dangerouslySetInnerHTML={{
                        __html: getH3SectionHTML({ ...baseProps, variant }),
                    }}
                />
            ))}
        </>
    );
}
