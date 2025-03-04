import { Slot, component$ } from '@builder.io/qwik';
import { Link, useLocation, type LinkProps } from '@builder.io/qwik-city';

type NavLinkProps = LinkProps & { activeClass?: string };

export const NavLink = component$(
  ({ activeClass, ...props }: NavLinkProps) => {
    const location = useLocation();
    const toPathname = props.href ?? '';
    const locationPathname = location.url.pathname;

    // Special case for global and international routes
    if (toPathname === '/global' || toPathname === '/international') {
      const isActive = locationPathname === toPathname || locationPathname === `${toPathname}/`;
      return (
        <Link
          {...props}
          class={`${props.class || ''} ${isActive && activeClass ? activeClass : ''}`}
        >
          <Slot />
        </Link>
      );
    }

    // Handle nested routes by constructing the correct path based on the URL structure
    let finalHref = toPathname;
    
    // Check if href is a simple section like 'polls', 'debates', etc.
    // and not already a full path like '/argentina/polls'
    if (!toPathname.includes('/') && location.params) {
      const { nation, region, subregion, locality } = location.params;
      
      // Build path based on available route parameters
      let basePath = '';
      
      if (nation) {
        basePath = `/${nation}`;
        
        if (region) {
          basePath += `/${region}`;
          
          if (subregion) {
            basePath += `/${subregion}`;
            
            if (locality) {
              basePath += `/${locality}`;
            }
          }
        }
      }
      
      // If we're on a path like /argentina/buenos-aires and the link is for 'polls',
      // construct /argentina/buenos-aires/polls
      if (basePath && toPathname) {
        finalHref = `${basePath}/${toPathname}`;
      }
    }

    // Check if the current location matches our link destination
    const isActive = locationPathname === finalHref || locationPathname === `${finalHref}/`;

    return (
      <Link
        {...props}
        href={finalHref}
        class={`${props.class || ''} ${isActive && activeClass ? activeClass : ''}`}
      >
        <Slot />
      </Link>
    );
  }
); 