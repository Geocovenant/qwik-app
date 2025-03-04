import { Slot, component$ } from '@builder.io/qwik';
import { Link, useLocation, type LinkProps } from '@builder.io/qwik-city';

type NavLinkProps = LinkProps & { activeClass?: string };

export const NavLink = component$(
  ({ activeClass, ...props }: NavLinkProps) => {
    const location = useLocation();
    const toPathname = props.href ?? '';
    const locationPathname = location.url.pathname;

    // Regla especial para '/global'
    if (toPathname === '/global') {
      const isActive = locationPathname === '/global' || locationPathname === '/global/';
      return (
        <Link
          {...props}
          class={`${props.class || ''} ${isActive && activeClass ? activeClass : ''}`}
        >
          <Slot />
        </Link>
      );
    }

    // Para otras rutas, verificar si la ruta actual coincide exactamente o es una subruta
    const isActive = 
      locationPathname === toPathname || 
      locationPathname === `${toPathname}/` ||
      locationPathname.startsWith(`${toPathname}/`);

    return (
      <Link
        {...props}
        class={`${props.class || ''} ${isActive && activeClass ? activeClass : ''}`}
      >
        <Slot />
      </Link>
    );
  }
); 