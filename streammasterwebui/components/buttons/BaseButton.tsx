import { getLeftToolOptions, getTopToolOptions } from '@lib/common/common';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import React, { CSSProperties, Suspense, forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  icon: string;
  iconFilled?: boolean;
  isLeft?: boolean;
  label?: string;
  onClick: (e: React.SyntheticEvent) => void;
  rounded?: boolean;
  severity?: 'danger' | 'help' | 'info' | 'secondary' | 'success' | 'warning';
  tooltip?: string;
  style?: CSSProperties | undefined;
  outlined?: boolean | undefined;
}

const BaseButton = forwardRef<Button, BaseButtonProps>(
  (
    {
      className,
      disabled = false,
      icon,
      iconFilled = true,
      isLeft = false,
      label,
      style,
      outlined = false,
      onClick,
      rounded = true,
      severity,
      tooltip = '',
      ...props
    },
    ref
  ) => {
    const tooltipClassName = React.useMemo(() => `basebutton-${uuidv4()}`, []);

    return (
      <>
        <Tooltip target={tooltipClassName} />
        <Button
          className={className + ' ' + tooltipClassName}
          disabled={disabled}
          icon={`pi ${icon}`}
          label={label}
          onClick={onClick}
          outlined={outlined}
          rounded={rounded}
          severity={severity}
          size="small"
          text={!iconFilled}
          ref={ref}
          style={style}
          {...props}
          pt={{
            label: { className: 'text-xs p-0 m-0' }
          }}
        />
      </>
    );
  }
);

export default BaseButton;
