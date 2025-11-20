import Image from 'next/image';
import type { SVGProps } from 'react';

export function AppIcon(props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & { width?: number; height?: number }) {
  const { width = 24, height = 24, ...rest } = props;
  return (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Logo_Kota_Medan_%28Seal_of_Medan%29.svg/500px-Logo_Kota_Medan_%28Seal_of_Medan%29.svg.png?20190418174340"
      alt="Logo Kota Medan"
      width={width}
      height={height}
      {...rest}
    />
  );
}
