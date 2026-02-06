const API = 'https://v4o8ksgos4wscwcg0ccgog8o.37.60.236.102.sslip.io/api';

async function main() {
  // Login
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@reqmanager.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const testCases = [
    {
      projectId: 13, title: 'TC-01: Registro de usuario valido',
      description: 'Verificar que un usuario puede registrarse correctamente',
      testType: 'e2e', priority: 'critical',
      preconditions: 'Navegador abierto en la pagina de registro',
      expectedResult: 'Usuario registrado y redirigido al dashboard',
      steps: [
        { step: 1, action: 'Navegar a /register', expected: 'Se muestra el formulario de registro' },
        { step: 2, action: 'Introducir email valido y password >= 6 chars', expected: 'Campos aceptados' },
        { step: 3, action: 'Confirmar password identico', expected: 'Campo aceptado' },
        { step: 4, action: 'Click en Registrarse', expected: 'Registro exitoso, redireccion a dashboard' }
      ],
      linkedRequirements: ['190']
    },
    {
      projectId: 13, title: 'TC-02: Login de usuario existente',
      description: 'Verificar que un usuario registrado puede iniciar sesion',
      testType: 'e2e', priority: 'critical',
      preconditions: 'Usuario registrado previamente',
      expectedResult: 'Login exitoso y redireccion al dashboard',
      steps: [
        { step: 1, action: 'Navegar a /login', expected: 'Se muestra el formulario de login' },
        { step: 2, action: 'Introducir email y password validos', expected: 'Campos aceptados' },
        { step: 3, action: 'Click en Iniciar sesion', expected: 'Login exitoso, redireccion al dashboard' }
      ],
      linkedRequirements: ['191']
    },
    {
      projectId: 13, title: 'TC-03: Cierre de sesion',
      description: 'Verificar que el usuario puede cerrar sesion',
      testType: 'e2e', priority: 'high',
      preconditions: 'Usuario autenticado en el dashboard',
      expectedResult: 'Sesion cerrada, redireccion a login',
      steps: [
        { step: 1, action: 'Estando en dashboard, click en boton logout del sidebar', expected: 'Se cierra sesion' },
        { step: 2, action: 'Verificar redireccion', expected: 'Se muestra pagina de login' }
      ],
      linkedRequirements: ['192']
    },
    {
      projectId: 13, title: 'TC-04: Crear nota nueva',
      description: 'Verificar que se puede crear una nota nueva',
      testType: 'e2e', priority: 'critical',
      preconditions: 'Usuario autenticado en el dashboard',
      expectedResult: 'Nota creada y visible en el sidebar',
      steps: [
        { step: 1, action: 'Click en boton Nueva nota', expected: 'Se crea una nota y se muestra el editor' },
        { step: 2, action: 'Verificar que aparece en el sidebar', expected: 'La nota aparece en la lista' }
      ],
      linkedRequirements: ['193']
    },
    {
      projectId: 13, title: 'TC-05: Editar titulo y contenido de nota',
      description: 'Verificar que se puede editar una nota existente',
      testType: 'e2e', priority: 'critical',
      preconditions: 'Nota creada previamente',
      expectedResult: 'Nota actualizada con nuevo titulo y contenido',
      steps: [
        { step: 1, action: 'Seleccionar nota existente en sidebar', expected: 'Nota cargada en el editor' },
        { step: 2, action: 'Modificar titulo', expected: 'Titulo actualizado' },
        { step: 3, action: 'Escribir contenido en el editor', expected: 'Contenido guardado automaticamente' }
      ],
      linkedRequirements: ['194']
    },
    {
      projectId: 13, title: 'TC-06: Eliminar nota',
      description: 'Verificar que se puede eliminar una nota',
      testType: 'e2e', priority: 'high',
      preconditions: 'Al menos una nota existente',
      expectedResult: 'Nota eliminada del sistema',
      steps: [
        { step: 1, action: 'Hover sobre nota en sidebar para ver boton eliminar', expected: 'Boton de eliminar visible' },
        { step: 2, action: 'Click en eliminar', expected: 'Dialogo de confirmacion' },
        { step: 3, action: 'Confirmar eliminacion', expected: 'Nota eliminada del sidebar' }
      ],
      linkedRequirements: ['195']
    },
    {
      projectId: 13, title: 'TC-07: Listar notas en sidebar',
      description: 'Verificar que las notas se listan ordenadas por fecha',
      testType: 'e2e', priority: 'high',
      preconditions: 'Varias notas creadas',
      expectedResult: 'Notas listadas en orden de modificacion descendente',
      steps: [
        { step: 1, action: 'Crear varias notas', expected: 'Notas creadas' },
        { step: 2, action: 'Verificar orden en sidebar', expected: 'La nota mas reciente aparece primera' }
      ],
      linkedRequirements: ['196']
    },
    {
      projectId: 13, title: 'TC-08: Editor de texto enriquecido',
      description: 'Verificar formatos del editor: negrita, cursiva, encabezados, listas, codigo, citas',
      testType: 'e2e', priority: 'critical',
      preconditions: 'Nota abierta en el editor',
      expectedResult: 'Todos los formatos de texto funcionan correctamente',
      steps: [
        { step: 1, action: 'Escribir texto y aplicar negrita', expected: 'Texto en negrita' },
        { step: 2, action: 'Aplicar cursiva', expected: 'Texto en cursiva' },
        { step: 3, action: 'Aplicar encabezado H1', expected: 'Texto como titulo H1' },
        { step: 4, action: 'Crear lista con viñetas', expected: 'Lista creada' },
        { step: 5, action: 'Crear bloque de codigo', expected: 'Bloque de codigo creado' }
      ],
      linkedRequirements: ['197']
    },
    {
      projectId: 13, title: 'TC-09: Busqueda de notas',
      description: 'Verificar que la busqueda filtra notas por titulo',
      testType: 'e2e', priority: 'high',
      preconditions: 'Varias notas con diferentes titulos',
      expectedResult: 'Se muestran solo las notas que coinciden',
      steps: [
        { step: 1, action: 'Escribir texto en campo de busqueda', expected: 'Notas filtradas por el termino' },
        { step: 2, action: 'Borrar busqueda', expected: 'Se muestran todas las notas de nuevo' }
      ],
      linkedRequirements: ['198']
    },
    {
      projectId: 13, title: 'TC-10: Autoguardado',
      description: 'Verificar que las notas se guardan automaticamente',
      testType: 'e2e', priority: 'high',
      preconditions: 'Nota abierta en el editor',
      expectedResult: 'Indicador de guardado visible tras escribir',
      steps: [
        { step: 1, action: 'Escribir contenido en la nota', expected: 'Indicador Guardando... aparece' },
        { step: 2, action: 'Esperar 2 segundos', expected: 'Indicador Guardado aparece' },
        { step: 3, action: 'Recargar pagina y verificar contenido', expected: 'Contenido persistido' }
      ],
      linkedRequirements: ['199']
    },
    {
      projectId: 13, title: 'TC-11: API REST Health Check',
      description: 'Verificar que el backend responde correctamente',
      testType: 'smoke', priority: 'critical',
      preconditions: 'Backend desplegado',
      expectedResult: 'API responde con status ok',
      steps: [
        { step: 1, action: 'GET /api/health', expected: 'Status 200 con {status: ok}' }
      ],
      linkedRequirements: ['200']
    },
    {
      projectId: 13, title: 'TC-12: Diseno responsive mobile',
      description: 'Verificar que la app es mobile-friendly',
      testType: 'e2e', priority: 'high',
      preconditions: 'App abierta en viewport movil (375px)',
      expectedResult: 'Sidebar colapsable, layout adaptado',
      steps: [
        { step: 1, action: 'Abrir app en viewport movil', expected: 'Sidebar oculto por defecto' },
        { step: 2, action: 'Click en menu hamburguesa', expected: 'Sidebar se despliega como overlay' },
        { step: 3, action: 'Seleccionar nota', expected: 'Sidebar se cierra y nota se muestra' }
      ],
      linkedRequirements: ['203']
    }
  ];

  for (const tc of testCases) {
    try {
      const res = await fetch(`${API}/test-cases`, {
        method: 'POST', headers: h, body: JSON.stringify(tc)
      });
      const data = await res.json();
      console.log(`${tc.title}: ${res.ok ? 'OK' : 'FAIL'} - ${data.data?.testCase?.id || data.message || 'error'}`);
    } catch (e) {
      console.log(`${tc.title}: ERROR - ${e.message}`);
    }
  }
}

main().catch(console.error);
