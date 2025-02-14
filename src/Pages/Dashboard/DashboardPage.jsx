import MainLayout from "../../Layouts/MainLayouts";

const DashboardPage = () => {
  return (
    <MainLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Bienbenido al Dashboard
        </h2>
        <p className="text-gray-600">
          Aquí irán estadisticas y gráficos de la aplicación
        </p>

       
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
