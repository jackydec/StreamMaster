import SMButton from '@components/sm/SMButton';
import { ChildButtonProperties } from './ChildButtonProperties';

const OKButton: React.FC<ChildButtonProperties> = ({ disabled, iconFilled = true, label, style, onClick, tooltip = '' }) => (
  <SMButton
    className="icon-green"
    disabled={disabled}
    icon="pi-check"
    iconFilled={iconFilled}
    label={iconFilled === true ? (label === null ? undefined : 'Ok') : undefined}
    onClick={onClick}
    rounded={iconFilled}
    style={style}
    tooltip={tooltip}
  />
);

export default OKButton;
