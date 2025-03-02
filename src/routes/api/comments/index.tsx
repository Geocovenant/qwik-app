import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";

// Esta es una función simulada para propósitos de demostración
// En una implementación real, esto llamaría a la API y devolvería datos reales
export const onGet: RequestHandler = async ({ json, cookie, query }) => {
  const pollId = query.get('pollId');
  const token = cookie.get('authjs.session-token');
  
  if (!pollId) {
    json(400, { error: 'Missing pollId parameter' });
    return;
  }
  
  try {
    // En una implementación real, esto sería una llamada a tu API backend
    let requestUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${pollId}/comments`;
    
    // Configurar headers con o sin token
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    
    // Añadir el token a los headers si existe
    if (token) {
      headers.Authorization = token.value;
    }
    
    const response = await fetch(requestUrl, {
      headers
    });

    if (!response.ok) {
      throw new Error('Error fetching poll comments');
    }

    const data = await response.json();
    json(200, data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    // Para propósitos de demostración, devolvemos datos de ejemplo
    // En producción, deberías devolver un error apropiado
    const mockComments = {
      items: [
        {
          id: 1,
          text: "¡Esta encuesta es muy interesante! Me encanta la perspectiva que ofrece.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          likesCount: 5,
          dislikesCount: 1,
          userReaction: null,
          user: {
            id: 101,
            username: "usuario_ejemplo",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=usuario_ejemplo"
          }
        },
        {
          id: 2,
          text: "No estoy de acuerdo con la opción B, creo que la C representa mejor la situación actual.",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString(),
          likesCount: 3,
          dislikesCount: 2,
          userReaction: null,
          user: {
            id: 102,
            username: "otro_usuario",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=otro_usuario"
          },
          replies: [
            {
              id: 3,
              text: "Estoy de acuerdo contigo, la opción C tiene más sentido.",
              created_at: new Date(Date.now() - 3600000).toISOString(),
              updated_at: new Date(Date.now() - 3600000).toISOString(),
              likesCount: 2,
              dislikesCount: 0,
              userReaction: null,
              user: {
                id: 103,
                username: "tercer_usuario",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=tercer_usuario"
              }
            }
          ]
        }
      ],
      total: 2,
      page: 1,
      size: 10,
      pages: 1
    };
    
    json(200, mockComments);
  }
}; 