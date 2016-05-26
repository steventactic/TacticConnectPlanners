'use strict';

angular.module('myApp.editarOrden', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editarOrden', {
    templateUrl: 'ordenesVenta/editarOrden.html',
    controller: 'editarOrdenCtrl'
  });
}])

.controller('editarOrdenCtrl',  [ '$scope', '$http','datatable','$mdDialog','$mdMedia','$mdToast','$location','Scopes','$rootScope',function($scope  , $http ,datatable ,  $mdDialog, $mdMedia , $mdToast ,$location ,Scopes  , $rootScope) {
  Scopes.store('editarOrdenCtrl', $scope);
  $scope.mensajeServidor = []; 

  if(window.localStorage.getItem("usuario") === "" ||
    window.localStorage.getItem("clave") === "" ||
    window.localStorage.getItem("idUsuario") === ""){
    console.log("usuario no logueado");
      $location.path('/login');

  }else{
    
  //$scope.login = Scopes.get('loginCtrl').login ; 
  $scope.login = {};
  $scope.login.usuario = window.localStorage.getItem("usuario");
  $scope.login.clave = window.localStorage.getItem("clave");
  $scope.login.mostrarMenu = true ;
  $scope.usuario = JSON.parse(window.localStorage.getItem("objetoUsuario"));
  $scope.login.id  = $scope.usuario.id;
 // $scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
  }
  var textoProductoOrden = "";
   // $scope.login = Scopes.get('loginCtrl').login ; 
  //$scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
  //$scope.login.id = $scope.jsonRespuesta.usuario.id ; 


$scope.dataTabs = {};

  if(edicionNueva  === 'no'){
      $scope.ordenSeleccionada = Scopes.get('listaOrdenesCtrl').ordenSeleccionada ;
      console.log("orden seleccionada");
      console.log($scope.ordenSeleccionada) ;
       $scope.dataTabs.tabSeleccionada =0;

  }else{
      $scope.ordenSeleccionada = {};
      $scope.ordenSeleccionada.idOrden =  Scopes.get('ordenesVentaCtrl').jsonFacturacionRetorno.orden.idOrden; 
      $scope.ordenSeleccionada.idTipoServicio =  Scopes.get('ordenesVentaCtrl').jsonFacturacionRetorno.orden.datosFacturacion.tipoServicio;
      console.log("orden ==> ");
      console.log(Scopes.get('ordenesVentaCtrl').jsonFacturacionRetorno.orden);
       $scope.dataTabs.tabSeleccionada =1;
  }




  $scope.mostrarEditar =  0;
  $scope.mostrarEliminar =  0;
  $scope.data = {};
  $scope.data.info = 0 ; 
  $scope.cantidadTotal  =  0 ; 
  $scope.admiteBodegasDestino  = 0 ; 

    $scope.cerrarSesion =  function (){
         window.localStorage.setItem("usuario" ,"");
         window.localStorage.setItem("clave" , "");
         window.localStorage.setItem("idUsuario" , "");
         window.localStorage.setItem('estadoOrdenCache',"");
         window.localStorage.setItem('tipoServicioCache',"");
         window.localStorage.setItem('clienteCache',"");
         console.log("cerrar sesion  ok  ");
         $location.path('/login');
  }

   $scope.volver = function (ev){
      $scope.jsonEdicion = [];

      //$state.go('/ordenesVenta');
          
          var confirm = $mdDialog.confirm()
                .title('Informacion')
                .textContent('Si retrocede se perderan todos los cambios que no se hayan guardado')
                .ariaLabel('Mensaje')
                .targetEvent(ev)
                .ok('ok')
                .cancel('Cancelar');
          $mdDialog.show(confirm).then(function() {
            
             $location.path('/listaOrdenes');
          }, function() {
            
            console.log("no hace nada");
          });

    }
    $scope.crearOrden = function (){
        //$state.go('/ordenesVenta');
        $location.path('/ordenesVenta');
    }


        $rootScope.contarProductosPorUnidad = function (lineas){
              $rootScope.textoUnidadesProducto = "";
                    $scope.lineas = lineas ;
                    $scope.unidadesValores = [];
                       $scope.posicion = 0 ; 
                         for (var i = 0; i < $scope.lineas.length ; i++) {
                                  if($scope.unidadesValores.length === 0){
                                     $scope.unidadesValores  = $scope.unidadesValores.concat([
                                                                          {
                                                                            nombre : $scope.lineas[i].nombreUnidad  ,
                                                                            cantidad : $scope.lineas[i].cantidad
                                                                          }
                                                                      ]);
                                  }else{
                                      for (var j = 0; j < $scope.unidadesValores.length; j++) {
                                      console.log( $scope.unidadesValores[j].nombre +" vs "+  $scope.lineas[i].nombreUnidad )  ; 
                                          if($scope.unidadesValores[j].nombre === $scope.lineas[i].nombreUnidad){
                                            console.log("entra true");
                                              $scope.agregarUnidadNueva = 1; 
                                              $scope.unidadesValores[j].cantidad = $scope.unidadesValores[j].cantidad  + $scope.lineas[i].cantidad;                                    
                                              
                                               j = $scope.unidadesValores.length+1;
                                               //    
                                              //console.log($scope.agregarUnidadNueva);                                                                     
                                          } else{
                                            console.log("entra false");
                                              $scope.agregarUnidadNueva = 0;
                                                                                                         
                                          }    
                                      }                                                                          
                                       if($scope.agregarUnidadNueva === 0 ){
                                      
                                            console.log("es diferente");
                                       
                                                $scope.unidadesValores  = $scope.unidadesValores.concat([
                                                                          {
                                                                            nombre : $scope.lineas[i].nombreUnidad  ,
                                                                            cantidad : $scope.lineas[i].cantidad
                                                                          }
                                                                    ]);
                                                // console.log(angular.toJson( $scope.unidadesValores, true));
                                                                                      
                                        }                            
                                  }               
                         }

                    

                         for (var i = 0 ; i < $scope.unidadesValores.length ; i++) {

                           $rootScope.textoUnidadesProducto += $scope.unidadesValores[i].nombre + ":" + $scope.unidadesValores[i].cantidad + "," ;
                         }

                         $rootScope.textoUnidadesProducto = $rootScope.textoUnidadesProducto.substr(0 , $rootScope.textoUnidadesProducto.length - 1 );
                         //$scope.cantidadTotal += $scope.lineas[i].cantidad ; 
                      
                      
                         console.log("texto completo   = " +  $rootScope.textoUnidadesProducto );

            }

  /*************************Objeto que  alamance la  io y el  puerto al cual conectarme****************************/
    $scope.serverData = {};
    //$scope.serverData.ip = "inglaterra";    
    //$scope.serverData.puerto = "8080";
    $scope.serverData.ip = hostName;
    $scope.serverData.puerto = puerto;
    $scope.serverData.usuario =  window.localStorage.getItem("idUsuario") ;
    $scope.tipoUbicacion = "" ; 
     
      $scope.dis = {};
     $scope.dis.tabEntrega = true ; 
    
    /*********************************Carga los tipos de sevicio por usaurio  ****************************************************/
    $scope.cargaTipoServicio =  function (){
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/tipos_servicio-x-usuario?id_usuario='+$scope.serverData.usuario)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.tipoServicioData = response.data;
              console.log("json cargado tipos de servicio por cliente ===>");
              console.log($scope.ordenSeleccionada);
              console.log("list tipo servicio ==>");
              console.log( $scope.tipoServicioData);
              if(edicionNueva  === 'no'){
                 
                  $scope.ordenSeleccionada.idTipoServicio = $scope.jsonEdicion.datosFacturacion.tipoServicio;

              }
               for (var i = 0 ; i < $scope.tipoServicioData.length ; i++) {

                 console.log("entra al for " + $scope.ordenSeleccionada.idTipoServicio )
                        if(parseInt($scope.ordenSeleccionada.idTipoServicio) === parseInt($scope.tipoServicioData[i].id)){
                            console.log("entro a if ==>" + $scope.tipoServicioData[i].nombre ) ; 
                            $scope.nombreTipoServicio = $scope.tipoServicioData[i].nombre ;  
                            console.log("registar destino en la orden  = " + $scope.tipoServicioData[i].registrarDesitinoEnLaOrden  );                         

                                  if($scope.tipoServicioData[i].tipoUbicacionOrden === 'DIRECCION')
                                  {
                                    $scope.tipoUbicacion  = 'DIRECCION' ; 
                                    console.log("HABILITAR SHIP TO  tipo ubicacion");
                                  }else{
                                    $scope.tipoUbicacion  = 'BODEGA';
                                    console.log("HABILITAR SHIP TO  BODEGA tipo ubicacion ");
                                  }

                                   if($scope.tipoServicioData[i].tipoUbicacionLineaOrden === 'DIRECCION')
                                  {
                                    $scope.tipoUbicacionLineaOrden  = 'DIRECCION' ; 
                                    console.log("HABILITAR SHIP TO  ubicacion linea orden ");
                                  }else{
                                    $scope.tipoUbicacionLineaOrden  = 'BODEGA';
                                    console.log("HABILITAR SHIP TO  BODEGA  ubicacion linea orden  ");
                                  }
                                  
                                  if($scope.tipoServicioData[i].rolUbicacionOrden === 'DESTINO')
                                  {
                                    $scope.origenDestinoTitulo  = 'Destino' ; 
                                    console.log("TITULO DESTINO ");
                                  }else{
                                    $scope.origenDestinoTitulo  = 'Origen';
                                    console.log("TITULO ORIGEN ");
                                  }
                 
                        }

                     }

         });    

    }
        

	  $scope.jsonFacturacion = {};
    $scope.jsonFacturacionEnvio = [];
    $scope.jsonEnvio = {};
    $scope.jsonEnvioEnvio = [];
    $scope.jsonEntrega =[];
    $scope.jsonEntregaEnvio=[];
    $scope.jsonEntregaProducto=[];
  
     

/***********************Tabla edicion de productos*********************************/
    var producto  = "";
    var idLineaOrden = "";
    var bodega = "";
    var cantidad = "" ; 
    var unidad = "";
    var lote ="";
    var notas ="";
    var alto = "";
    var largo = "";
    var ancho = "";
    var volumen = "";
    var total = "";
    var pesoBruto  ="";
    var totalKilos = "";
    var pesoVolumetrico = "";
    var totalVolumen = "";
    var valorDeclarado ="";
    var totalDeclarado = "";
    var idProductoEdit = "";
    var nombreProducto = "";
    var idUnidadMedidaEdicion = "";
    var nombreUnidadMedidaEdicion = "";
    var codigoProducto = ""
    var ciudadNombreAlterno = "";
    var codigoBodegaAlterno = "";
    var nombreBodegaAlterno = "";
    var codigoProductoAlterno = "";
    var nombreProductoAlterno = "";
    var codigoUnidadAlterno = "";
    var numeroItem = "";

            $scope.columnDefs= [
                              {field:'numeroItem', displayName: 'Línea',visible: true , width : '5%'},
                              {field:'codigoProducto', displayName: 'Producto' ,visible: true , width : '12%'},                              
                              {field:'nombreProducto', displayName: 'Nombre producto',visible: true , width : '24%'},                              
                              {field:'codigoUnidad', displayName: 'Unidad',visible: true , width : '10%'},
                              {field:'codigoUnidadAlterno', displayName: 'Unidad alterno',visible: true, width : '16%'},                        
                              {field:'cantidad', displayName: 'Cantidad' ,visible: true , width : '8%'},                              
                              {field:'codigoBodega', displayName: 'Bodega' ,visible:true , width : '12%'}, 
                              {field:'nombreBodega', displayName: 'Nombre bodega' ,visible: true , width : '12%'},  
                              {field:'lote', displayName: 'Lote' ,visible: true , width : '12%'} ,                                                         
                              {field:'notas', displayName: 'Notas',visible: true , width : '40%'},                              
                              {field:'usuario', displayName: 'usuario',visible: true , width : '12%'},
                              {field:'fechaActualizacion', displayName: 'Fecha actualización',visible: true , width : '18%'},
                              {field:'codigoProductoAlterno', displayName: 'Producto alterno' ,visible: true, width : '16%'},
                              {field:'bodega', displayName: 'Bodega' , visible: false},                                                                                     
                              {field:'disponibilidad', displayName: 'Disponibilidad',visible: false},                            
                              {field:'idLineaOrden', displayName: 'Id linea orden' ,visible: false},
                              {field:'idOrden', displayName: 'Id  orden' ,visible: false},
                              {field:'idUsuario', displayName: 'Id  usuario' ,visible: false},                                                                                         
                              {field:'nombreUnidad', displayName: 'Nombre unidad',visible: false},                                                            
                              {field:'producto', displayName: 'producto',visible: false},
                              {field:'unidad', displayName: 'unidad',visible: false},
                              {field:'altoPorUnidad', displayName: 'alto unidad',visible: false},
                              {field:'anchoPorUnidad', displayName: 'anchoPorUnidad',visible: false},
                              {field:'anchoPorUnidad', displayName: 'anchoPorUnidad',visible: false},
                              {field:'largoPorUnidad', displayName: 'largoPorUnidad',visible: false},
                              {field:'pesoBrutoPorUnidad', displayName: 'pesoBrutoPorUnidad',visible: false},
                              {field:'valorDeclaradoPorUnidad', displayName: 'valorDeclaradoPorUnidad',visible: false},
                              {field:'ciudadNombreAlterno', displayName: 'ciudadNombreAlterno',visible: false},
                              {field:'codigoBodegaAlterno', displayName: 'codigoBodegaAlterno',visible: false},
                              {field:'nombreBodegaAlterno', displayName: 'nombreBodegaAlterno',visible: false},
                              {field:'codigoProductoAlterno', displayName: 'codigoProductoAlterno',visible: false},
                              {field:'nombreProductoAlterno', displayName: 'nombreProductoAlterno',visible: false}


                              
                            ];

        function rowTemplate() {
                  return '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
                               '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                               '</div>';
        }

          $scope.rowDblClick = function( row) {
       //   alert(JSON.stringify(row.entity)); 
            $scope.editarLinea();
          }


     $scope.gridOptions = {enableRowSelection: true, 
                enableRowHeaderSelection: false,
                selectedItems: $scope.selections,
                enableRowSelection: true,
                enableColumnResize: true,
                columnDefs : $scope.columnDefs,
                rowTemplate: rowTemplate()            
                };
     $scope.gridOptions.multiSelect = false;
              $scope.gridOptions.onRegisterApi = function( gridApi ) {
                  $scope.gridApi = gridApi;
                    $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                        console.log("entra");
                        console.log( row.entity.idOrden);
                        $scope.ordenSeleccionada =  row.entity ; 
                        console.log(row);
                        console.log(row.entity.idLineaOrden);
                       // console.log("producto seleccionado" + row.entity.nombreProducto  + "---" +row.entity.codigoProducto );
                       // alert(row.entity.codigoProducto);
                        idLineaOrden =  row.entity.idLineaOrden ; 
                        producto = row.entity.producto;
                        bodega = row.entity.nombreBodega;
                        cantidad = row.entity.cantidad;
                        unidad = row.entity.nombreUnidad;
                        alto =  row.entity.altoPorUnidad ;
                        ancho =  row.entity.anchoPorUnidad;
                        largo = row.entity.largoPorUnidad;
                        pesoBruto = row.entity.pesoBrutoPorUnidad;
                        valorDeclarado = row.entity.valorDeclaradoPorUnidad; 
                        idProductoEdit = row.entity.producto;
                        nombreProducto = row.entity.nombreProducto;
                        idUnidadMedidaEdicion = row.entity.unidad;
                        nombreUnidadMedidaEdicion = row.entity.nombreUnidad;
                        codigoProducto = row.entity.codigoProducto;
                        numeroItem = row.entity.numeroItem ;
                        //alert(codigoProducto);
                        ciudadNombreAlterno = row.entity.ciudadNombreAlterno;
                        codigoBodegaAlterno = row.entity.codigoBodegaAlterno;
                        nombreBodegaAlterno = row.entity.nombreBodegaAlterno;
                        codigoProductoAlterno = row.entity.codigoProductoAlterno;
                        nombreProductoAlterno = row.entity.nombreProductoAlterno;
                        codigoUnidadAlterno = row.entity.codigoUnidadAlterno;
                       // $scope.prodCli.nombreLargo =row.entity.nombreProducto;
                        lote = row.entity.lote;
                        notas  = row.entity.notas ;
                        $scope.mostrarEditar =  1;
                        $scope.mostrarEliminar =  1;
                      });
      };


      $rootScope.mostrarValorDeclarado = true;
     console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/'+$scope.ordenSeleccionada.idOrden)     
     $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/'+$scope.ordenSeleccionada.idOrden)     
     //$http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/87')
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
              
              $scope.jsonEdicion= response.data;
             
              // console.log("info de edicion == >" + $scope.jsonEdicion.datosFacturacion.nombre) ;
               console.log("llega a edicion ==>") ; 
               console.log(response.data) ;      

               //verificar valor declarado 
               console.log("lineas");
               console.log($scope.jsonEdicion.lineas);   

                for (var i = 0; i < $scope.jsonEdicion.lineas.length; i++) {
                  
                   if($scope.jsonEdicion.lineas[i].valorDeclaradoPorUnidad  !=  null){
                      $rootScope.mostrarValorDeclarado = false;

                   }

                }
                if($rootScope.mostrarValorDeclarado){
                  console.log("NO hay valor declarado en ninguna linea");
                }else{
                  console.log("Ya existe un valor declarado en la linea")

                }

               /*********Valida alternos en datos facturacion***********************/
               $scope.jsonFacturacion =  $scope.jsonEdicion.datosFacturacion ;
              // alert($scope.jsonFacturacion.nombre);
               //alert($scope.jsonFacturacion.telefonos);
               //alert($scope.jsonFacturacion.email);
                $scope.dest.selectedItem ={}                    
                    $scope.dest.selectedItem.nombre  =  $scope.jsonFacturacion.nombreDestinatario;
                    $scope.dest.selectedItem.id = $scope.jsonFacturacion.destinatario;


               $scope.mostrarAlternoBillToSegmento = false;
               if($scope.jsonFacturacion.codigoAlternoSegmento != null ||
                  $scope.jsonFacturacion.codigoAlternoSegmento != ''  ){
                  $scope.mostrarAlternoBillToSegmento = false;                
               }else{
                  $scope.mostrarAlternoBillToSegmento = true;
               }

               $scope.mostrarAlternoBillToDestinatario = false;
               if($scope.jsonFacturacion.nombreAlternoDestinatario != null ||
                  $scope.jsonFacturacion.nombreAlternoDestinatario != '' || 
                  $scope.jsonFacturacion.nombreAlternoDestinatario != null ||
                  $scope.jsonFacturacion.nombreAlternoDestinatario != '' ||
                  $scope.jsonFacturacion.numeroIdentificacionAlternoDestinatario != null ||
                  $scope.jsonFacturacion.numeroIdentificacionAlternoDestinatario != '' ){
                  $scope.mostrarAlternoBillToDestinatario = false;
               }else{
                  $scope.mostrarAlternoBillToDestinatario = true;
               }
               /*********fin  alternos en datos facturacion***********************/

               $scope.cargaTipoServicio();
          
                
               $scope.jsonEnvio = $scope.jsonEdicion.destinoOrigen  ; 

               /*********Valida alternos en destinoOrigen***********************/
                $scope.mostrarAlternoShipToCiudad = false;
                if($scope.jsonEnvio.ciudadCodigoAlterno != null ||
                   $scope.jsonEnvio.ciudadCodigoAlterno != ''  || 
                   $scope.jsonEnvio.ciudadNombreAlterno != null ||
                   $scope.jsonEnvio.ciudadNombreAlterno != ''){
                  $scope.mostrarAlternoShipToCiudad = false;

                }else{
                    $scope.mostrarAlternoShipToCiudad = true;

                }

                $scope.mostrarAlternoShipToDestino= false;
                if($scope.jsonEnvio.destinoCodigoAlterno  != null ||
                   $scope.jsonEnvio.destinoCodigoAlterno != '' || 
                   $scope.jsonEnvio.destinoNombreAlterno != null ||
                   $scope.jsonEnvio.destinoNombreAlterno != '' ){
                  $scope.mostrarAlternoShipToDestino= false;

                }else{
                  $scope.mostrarAlternoShipToDestino= true;

                }

                  /*********FIN Valida alternos en destinoOrigen***********************/

                  /**************Valida alternos Bodega destino origen ******************************/
                  $scope.bodegaDestinoOrigen  =  $scope.jsonEdicion.bodegaDestinoOrigen;
                   $scope.mostrarAlternoShipToDestinoBodega= false;
                   if($scope.bodegaDestinoOrigen.bodegaCodigoAlterno != null || 
                      $scope.bodegaDestinoOrigen.bodegaCodigoAlterno != ''   ||
                      $scope.bodegaDestinoOrigen.bodegaNombreAlterno != null ||
                      $scope.bodegaDestinoOrigen.bodegaNombreAlterno != ''){
                      $scope.mostrarAlternoShipToDestinoBodega= false;

                   }else{
                      $scope.mostrarAlternoShipToDestinoBodega= true;
                   }

                   $scope.mostrarAlternoShipToBodegaCiudad= false;
                   if($scope.bodegaDestinoOrigen.ciudadCodigoAlterno  != null ||
                      $scope.bodegaDestinoOrigen.ciudadCodigoAlterno  != ''  ||
                      $scope.bodegaDestinoOrigen.ciudadNombreAlterno  != null   || 
                      $scope.bodegaDestinoOrigen.ciudadNombreAlterno  != ''  ) {
                      $scope.mostrarAlternoShipToBodegaCiudad= false;
                   }else{
                    $scope.mostrarAlternoShipToBodegaCiudad= true;
                   }




                  /**************Valida alternos Bodega destino origen ******************************/





                 $scope.jsonEntrega  = $scope.jsonEdicion.datosEntregaRecogida;
                 $scope.lineas = $scope.jsonEdicion.lineas ; 
                 $scope.jsonOtros = $scope.jsonEdicion.datosOtros;
                if($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima != null ){
                  if($scope.jsonEdicion.datosEntregaRecogida.fechaMinima === $scope.jsonEdicion.datosEntregaRecogida.fechaMaxima ){
                    
                    $scope.data.info =  0;
                    $scope.jsonEntrega.fechaMaxima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                    $scope.jsonEntrega.fechaMinima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMinima);
                    console.log("fecha  unica");
                  
                 }else if($scope.jsonEdicion.datosEntregaRecogida.fechaMinima === null) {// if ($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima != $scope.jsonEdicion.datosEntregaRecogida.fechaMinima){
                     
                    $scope.data.info =  0;
                    $scope.jsonEntrega.fechaMaxima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                    $scope.jsonEntrega.fechaMinima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                    console.log("fecha  unica 2");

                 }else{
                   $scope.data.info =  0;
                    $scope.jsonEntrega.fechaMaxima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                    $scope.jsonEntrega.fechaMinima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMinima);
                    console.log("fecha rango fecha");

                 }
                } else {
                    $scope.data.info =  3;
                    $scope.jsonEntrega.fechaMaxima =  null;
                    $scope.jsonEntrega.fechaMinima = null;
                    console.log("fecha  no confirmada");                 
                }
               //}
               //valore spor defecto para   la edicion
               //$scope.app.searchText.nombre = $scope.jsonFacturacion.nombreTipoServicio;
               //$scope.cli.searchText.nombre = $scope.jsonFacturacion.nombreCliente;               
               $scope.cargaClientes();
               $scope.cargaDestinatarios();
               $scope.cargaSegmentos();               
               $scope.cargaCiudadEnvio(0,0);
               $scope.cargaDestinosEnvio();
               $scope.cargaInfoDestinoEnvio();
               $scope.cargarConfiguracion();
               $scope.cargaCiudadEnvioShiptToBodega();
               $scope.cargaFormasDePago();
               console.log("json entrega =>" );
               console.log($scope.jsonEntrega) ; 
               $rootScope.contarProductosPorUnidad($scope.lineas);

               console.log(angular.toJson( $scope.unidadesValores, true));
               $scope.gridOptions.data = [] ;
               $scope.gridOptions.data = $scope.lineas ;
               $scope.gridApi.core.refresh();
              // console.log("data facturacion ");
              // console.log($scope.jsonFacturacion);
              // console.log($scope.jsonFacturacion.nombre);
        });    
    /************************Carga  info de  clientes  *******************************************/
      $scope.cargaClientes = function(){
        
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/clientes-x-usuario?id_usuario='+$scope.login.id+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/clientes-x-usuario?id_usuario='+$scope.login.id+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
      //$http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/clientes-x-usuario?id_usuario='+$scope.login.id)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.clientes = response.data;
               console.log("json cargado cliente ===> " );
               console.log($scope.clientes) ; 

          });    
    }

      /***********************Carga json segmentos*******************************************/
      $scope.cargaSegmentos = function(){
        $scope.segmento= [];
        $scope.destinatario = [];
       
       
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/segmentos-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
                $scope.cargarConfiguracion();
                $scope.segmento= response.data;
               console.log("json cargado segmento ===> " );
               console.log($scope.segmento) ; 

        });          
    }

      /*************************Combo deestinartario por  tipo de servicio y clientes*******************************/
      $scope.destinatario = [];
        $scope.cargaDestinatarios = function (){
          console.log("entra cargar destinatarios");
          console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/destinatarios_remitentes-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+$scope.jsonFacturacion.segmento);
           $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/destinatarios_remitentes-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+$scope.jsonFacturacion.segmento)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                   console.log("error ===>");
                    console.log(status);
                    console.log(data);
                    console.log(headers);
                    console.log(config);
            
              })
              .then(function(response){
               
                $scope.destinatario= response.data;
                console.log("json cargado deestinartario ===> " );
                console.log($scope.destinatario) ; 
             

           });    

        }

        /*************************Combo ciudad*******************************************/
           
          $scope.mostrarMensajeCambiarDatos = function (){
                   for (var i = 0; i < $scope.destinatario.length; i++) {
                 
             
                                         if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                                          //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                                         // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                                            //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;
                                            //if( $scope.destinatario[i].contacto.nombres != "" && $scope.destinatario[i].contacto.telefonos != "" &&  $scope.destinatario[i].contacto.email != "" ){
                                              //      $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                               //     $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                                //    $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                                            //}else{
/*
                                              var confirm = $mdDialog.confirm()
                                                    .title('Informacion')
                                                    .textContent('Desea reemplazar los datos de contacto e.')
                                                    .ariaLabel('Mensaje')
                                                    .targetEvent()
                                                    .ok('ok')
                                                    .cancel('Cancelar');
                                              $mdDialog.show(confirm).then(function() {
                                               // $scope.cargaCiudadEnvio(1,0);
                                                       
                                              }, function() {
                                                
                                                console.log("no hace nada");
                                              });*/

                                        
                                          
                                         

                            }
                                      
                      };
          }
        $scope.primerIngresoDesitinatarios  =  true ; 
        $scope.cargaCiudadEnvio = function(val, id){
          
          console.log("llama evento cargar ciudad envio"  + val + " id = " + id);
          if(parseInt(id) != 0 )
          {          
            $scope.jsonFacturacion.destinatario = val ; 
          }
          
          console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
          $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                   console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
                $rootScope.ciudad= response.data;
               //console.log("json cargado ciudad ===> "+$scope.destinatario[0].id   + "----" +  $scope.jsonFacturacion.destinatario );
               console.log($scope.ciudad) ; 

              
               /*$scope.jsonFacturacion.nombre  = $scope.jsonFacturacion.nombre ;
               $scope.jsonFacturacion.telefonos  = $scope.jsonFacturacion.telefonos;
               $scope.jsonFacturacion.email  = $scope.jsonFacturacion.email;*/
             
                  if(val === 0 ){

                    console.log("no hace nada");
                    /*for (var i = 0; i < $scope.destinatario.length; i++) {
                 
             
                     if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                      //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                     // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                        //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;                        
                                alert("antes"  +$scope.jsonFacturacion.nombre) ; 
                                $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        
                                alert("despues"  +$scope.jsonFacturacion.nombre) ; 

                              
                     }
                  
                 }*/

              }else{

                   for (var i = 0; i < $scope.destinatario.length; i++) {
                 
             
                                         if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                                          //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                                         // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                                            //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;
                                            $rootScope.nombreDest = $scope.destinatario[i].contacto.nombres;
                                            $rootScope.telefonoDest = $scope.destinatario[i].contacto.telefonos;
                                            $rootScope.emailDest = $scope.destinatario[i].contacto.email;
                                            if(  $scope.jsonFacturacion.nombre === "" &&   $scope.jsonFacturacion.telefonos === "" &&  $scope.jsonFacturacion.email  === "" ){
                                                  //  alert("antes 2" + $scope.jsonFacturacion.nombre);
                                                    $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                                    $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                                    $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        
                                                //    alert("despues 2" + $scope.jsonFacturacion.nombre);

                                            }else{
                                               if(id === 1 ){
                                                  if($scope.primerIngresoDesitinatarios){
                                                     //alert("antes" +  $scope.jsonFacturacion.nombre );
                                                     //$scope.jsonFacturacion.nombre  = $rootScope.nombreDest;
                                                     //$scope.jsonFacturacion.telefonos  =$rootScope.telefonoDest ;
                                                     //$scope.jsonFacturacion.email  =$rootScope.emailDest ; 
                                                     $scope.primerIngresoDesitinatarios = false ;     
                                                     //alert("despues" +  $scope.jsonFacturacion.nombre );   
                                                     return ; 
                                                  }else{
                                                        var confirm = $mdDialog.confirm()
                                                    .title('Informacion')
                                                    .textContent('Desea reemplazar los datos de contacto .')
                                                    .ariaLabel('Mensaje')
                                                    .targetEvent()
                                                    .ok('ok')
                                                    .cancel('Cancelar');
                                                     $mdDialog.show(confirm).then(function() {
                                                      console.log("datoa a reemplazar ");
                                                      console.log($rootScope.nombreDest) ; 
                                                      console.log($rootScope.telefonoDest) ; 
                                                      console.log($rootScope.emailDest) ; 
                                                        $scope.jsonFacturacion.nombre  = $rootScope.nombreDest;
                                                        $scope.jsonFacturacion.telefonos  =$rootScope.telefonoDest ;
                                                        $scope.jsonFacturacion.email  =$rootScope.emailDest ;        
                                                       
                                              }, function() {                                              
                                                console.log("no hace nada");
                                              });

                                                  }

                                          }
                                                                                
                                      }
                                                                                    

                            }
                                      
                      };
              

            }
          

              /*if(val === 0 ){
                for (var i = 0; i < $scope.destinatario.length; i++) {
                 
             
                     if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                      //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                     // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                        //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;                        
                                $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                              
                     }
                  
                 }

              }else{

                   for (var i = 0; i < $scope.destinatario.length; i++) {
                 
             
                                         if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                                          //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                                         // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                                            //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;
                                            $rootScope.nombreDest = $scope.destinatario[i].contacto.nombres;
                                            $rootScope.telefonoDest = $scope.destinatario[i].contacto.telefonos;
                                            $rootScope.emailDest = $scope.destinatario[i].contacto.email;
                                            if(  $scope.jsonFacturacion.nombre === "" &&   $scope.jsonFacturacion.telefonos === "" &&  $scope.jsonFacturacion.email  === "" ){
                                                    $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                                    $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                                    $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                                            }else{
                                               if(id === 0 ){
                                                    var confirm = $mdDialog.confirm()
                                                    .title('Informacion')
                                                    .textContent('Desea reemplazar los datos de contacto et.')
                                                    .ariaLabel('Mensaje')
                                                    .targetEvent()
                                                    .ok('ok')
                                                    .cancel('Cancelar');
                                              $mdDialog.show(confirm).then(function() {
                                                    $scope.jsonFacturacion.nombre  = $rootScope.nombreDest;
                                                    $scope.jsonFacturacion.telefonos  =$rootScope.telefonoDest ;
                                                    $scope.jsonFacturacion.email  =$rootScope.emailDest ;        
                                                       
                                              }, function() {                                              
                                                console.log("no hace nada");
                                              });
                                              }else{
                                                   $scope.jsonFacturacion.nombre  = $rootScope.nombreDest;
                                                    $scope.jsonFacturacion.telefonos  =$rootScope.telefonoDest ;
                                                    $scope.jsonFacturacion.email  =$rootScope.emailDest ;        

                                              }                                            
                                          }
                                                                                    

                            }
                                      
                      };

              }*/
                /*for (var i = 0; i < $scope.destinatario.length; i++) {
                 
             
                     if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                      //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                     // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                        //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;                        
                                $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                                         
                         

                     }
                  
                 };*/              

          });    

        }      
         /*******************************Combo destino  *********************************************/
   
        $scope.destino = [];
        $scope.cargaDestinosEnvio = function (){
            console.log("entra cargar destinos envio ");
            console.log("")
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonEnvio.ciudad+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                   console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.destino= response.data;
               console.log("json cargado destino ===> " );
               console.log(angular.toJson($scope.destino, true)) ; 

          });    

        }

        /***********hace set del valor de bodega *******************/
        $scope.asignoDestinatario=function(){

            $scope.dis.tabEntrega = false ; 
        }
        /******************************Cargar informacion destino envio***************/

        $scope.cargaInfoDestinoEnvio = function (id){

          console.log("evento carga info destino"); 
          console.log($scope.destino);

          for (var i = 0; i < $scope.destino.length; i++) {
            
            if(parseInt($scope.jsonEnvio.destino) === $scope.destino[i].id ){

             
                       $rootScope.nombreShipDest =   $scope.destino[i].contacto.nombres;
                       $rootScope.direccionShipDest =   $scope.destino[i].direccion.direccion;
                       $rootScope.indicacionesShipDest =    $scope.destino[i].direccion.indicacionesDireccion;
                       $rootScope.telefonoShipDest =   $scope.destino[i].contacto.telefonos ;
                       $rootScope.emailShipDest =  $scope.destino[i].contacto.email;
                      if(  $scope.jsonEnvio.nombre === "" &&   
                           $scope.jsonEnvio.telefonos === "" &&  
                           $scope.jsonEnvio.email  === "" 
                          ){
                                 $scope.jsonEnvio.direccion = $scope.destino[i].direccion.direccion;
                                 $scope.jsonEnvio.nombre = $scope.destino[i].contacto.nombres;
                                 $scope.jsonEnvio.indicacionesDireccion = $scope.destino[i].direccion.indicacionesDireccion ;
                                 $scope.jsonEnvio.telefonos =  $scope.destino[i].contacto.telefonos ;
                                 $scope.jsonEnvio.email = $scope.destino[i].contacto.email ;

                      }else{

                        var confirm = $mdDialog.confirm()
                              .title('Informacion')
                              .textContent('Desea reemplazar los datos de contacto.')
                              .ariaLabel('Mensaje')
                              .targetEvent()
                              .ok('ok')
                              .cancel('Cancelar');
                        $mdDialog.show(confirm).then(function() {
                                //$scope.jsonEnvio.direccion =  $rootScope.direccionShipDest;
                                 $scope.jsonEnvio.nombre =   $rootScope.nombreShipDest;
                                 //$scope.jsonEnvio.indicacionesDireccion =  $rootScope.indicacionesShipDest ;
                                 $scope.jsonEnvio.telefonos =  $rootScope.telefonoShipDest ;
                                 $scope.jsonEnvio.email =   $rootScope.emailShipDest;     
                                 
                        }, function() {
                          
                          console.log("no hace nada");
                        });

                  
                    }

            }
              
          }
          $scope.dis.tabEntrega = false ; 
               


	 }


   /*******************************Combo productos  por  cliente  *********************************************/
       $scope.productosCliente = [];

        $scope.cargarProductosCliente = function (cliente,tipoServicio){
              
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+cliente+'&id_tipo_servicio='+tipoServicio)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                   console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.productosCliente= response.data;
              console.log("json cargado productos ===> " );
              console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+cliente+'&id_tipo_servicio='+tipoServicio);

               console.log($scope.productosCliente) ; 

          });    

        }

      /*******************************Combo jornada  *********************************************/

    /*  $scope.jornadaEntrega= [
                   {"id":"1", "texto":"Am"},
                   {"id":"2", "texto":"Pm"},
                   {"id":"3", "texto":"Am/Pm"}                
        ];*/
       $scope.configuracionData = [];


        $scope.cargarConfiguracion = function (cliente,tipoServicio){
              
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio+'&id_cliente='+$scope.jsonFacturacion.cliente)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                   console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.configuracionData= response.data;
              console.log("json cargado configuracion ===> " );
              console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio+'&id_cliente='+$scope.jsonFacturacion.cliente);

               console.log($scope.configuracionData) ; 
               console.log("-----------------------------------")
              $scope.jornadaEntrega = $scope.configuracionData[0].jornadas;
              $scope.requerimientosDocumentales =  $scope.configuracionData[1].requerimientosDocumentales ; 
               console.log($scope.configuracionData[0].jornadas);
               console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
               console.log($scope.configuracionData[1].requerimientosDocumentales);

          });    

        }

         $scope.cargaCiudadEnvioShiptToBodega = function(){
       
          $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/ciudades-con-bodega-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                //alert("**** Verificar conexion a internet ****");
                    console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
                $scope.ciudadShipTOBodega= response.data;
               console.log("json cargado ciudad ship to bodega ===> ");
               console.log($scope.ciudadShipTOBodega) ; 
         

          });    

        }

         $scope.cargaBodegasShiptToBodegas = function (val){
           //   $scope.jsonEnvio.valorBodegaShipTo  = val ;
             $scope.jsonEnvio.valorBodegaShipTo   = $scope.jsonEnvio.ciudad ; 
              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/bodegas-x-ciudad-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_ciudad='+$scope.jsonEnvio.valorBodegaShipTo+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/bodegas-x-ciudad-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_ciudad='+$scope.jsonEnvio.valorBodegaShipTo+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                         console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.bodegasShipToBodega= response.data;
                

                     console.log($scope.bodegasShipToBodega) ; 

                });    
                
            }
         

          /**************************Carga formas de pago*************************************************/
            $scope.cargaFormasDePago = function (){
             console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/tipos_forma_pago-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio);
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/tipos_forma_pago-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                  
                    })
                    .then(function(response){
                     
                    $scope.formasPago= response.data;                   
                    console.log("respuesta formas de pago ==>");
                    console.log($scope.formasPago) ; 

                });    
                   
            }
         /*********************Cargar  hora apartir de  la  seleccion de  jornada******************************/ 
         $scope.cargaHoras = function (){
             for (var i =  0; i < $scope.jornadaEntrega.length; i++) {
                if($scope.jsonEntrega.jornada ===$scope.jornadaEntrega[i].codigo )
                {
                    console.log("Entra");
                    $scope.jsonEntrega.horaMinima = $scope.jornadaEntrega[i].horaMinima;
                    $scope.jsonEntrega.horaMaxima = $scope.jornadaEntrega[i].horaMaxima
                }
             };

         }

        $scope.estadoEntrega= [
                   {"id":"1", "texto":"En elaboracion"}
                 
        ];

         $scope.opcionEntrega= [
                   {"id":"1", "texto":"Corte mas proximo"}
                 
        ];
         
    var test = 10  ;
    var producto  = "";
    var bodega = "";
    var cantidad = "" ; 
    var unidad = "";
    var lote ="";
    var notas ="";
      $scope.productosTemporales = [];
      $scope.imprimir = function (){
      $scope.productosTemporales=  $scope.productosTemporales.concat([
                                  {
                                    "producto":producto, 
                                    "bodega":bodega,
                                     "cantidad" : cantidad  ,
                                     "unidad"  : unidad , 
                                     "lote":lote,
                                     "notas" :notas
                                  }
                              ]);
     
      //console.log(angular.toJson($scope.productosTemporales, true));
            }
     /*********************eliminar linea ******************************/
      $scope.eliminarLinea= function ()
      {

        console.log("Entra a eliminar" + idLineaOrden);
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/'+$scope.ordenSeleccionada.idOrden+'/deleteLineaOrden/'+idLineaOrden+'/'+$scope.login.usuario);
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/'+$scope.ordenSeleccionada.idOrden+'/deleteLineaOrden/'+idLineaOrden+'/'+$scope.login.usuario)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
            //    alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.respuestaEliminacion= response.data;
               console.log("json respuesta eliminar  linea ===> " );                 
               console.log($scope.respuestaEliminacion) ; 
               if ($scope.respuestaEliminacion.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.respuestaEliminacion.mensajes.mensajes[0].texto )

                 }else{

                  $scope.gridOptions.data = [] ;
                  $scope.gridOptions.data = $scope.respuestaEliminacion.orden.lineas ;
                  $rootScope.contarProductosPorUnidad($scope.respuestaEliminacion.orden.lineas);
                }


          });    


      }

            /************editar evento ********************/
      $scope.esEdicion =  0 ; 
      $scope.editarLinea = function(){
            $scope.esEdicion =  1 ; 
            $scope.showAdvanced();
            //    $scope.jsonProductoAdd.producto = "";
                //$scope.jsonProductoAdd.bodega ="" ;
                
              //  $scope.onProductoAdd.unidad = "";
             

      }
/**************Agregar producto**********************/
   
      $scope.agregarLinea = function(){
            $scope.esEdicion =  0 ; 
            $scope.showAdvanced();
            //    $scope.jsonProductoAdd.producto = "";
                //$scope.jsonProductoAdd.bodega ="" ;
                
              //  $scope.jsonProductoAdd.unidad = "";             
      }

      /*************************Ventana  modal de agregar  producto ********************************************/
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
       $scope.showAdvanced = function(ev) {
        
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogController,
          //  templateUrl: './ordenesVenta/agregarProducto.tmpl.html',
            templateUrl: './ordenesVenta/agregarProductoSt.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                       jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       ordenSeleccionada :$scope.ordenSeleccionada,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion,
                       cantidadTotal:$scope.cantidadTotal,
                       tipoUbicacionLineaOrden: $scope.tipoUbicacionLineaOrden , 
                       ciudad : $scope.ciudad 
                     }
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };


         $scope.cerrarAdvanced = function(){
          console.log("entra");
          $mdDialog.hide()

         }

     
        function DialogController($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login,ordenSeleccionada ,gridOptions ,esEdicion,cantidadTotal , tipoUbicacionLineaOrden, ciudad  ) {

              
              $scope.login = login ; 
              $scope.serverData =serverData;
              $scope.jsonFacturacion = jsonFacturacion;
              $scope.datatable = []
              $scope.productosTemporales  = productosTemporales;
              $scope.imprimir   =  imprimir;
              $scope.datatable = tabla;
              $scope.jsonProductoAdd = [];
              $scope.jsonProductoAdd.disponible = 275;
              $scope.jsonEntregaRetorno = jsonEntregaRetorno;
              $scope.jsonEntregaProducto = [];              
              $scope.ordenSeleccionada = ordenSeleccionada ;
              $scope.gridOptions = gridOptions ; 
              $scope.esEdicion = esEdicion ; 
              $scope.cantidadTotal = cantidadTotal;
              $scope.tipoUbicacionLineaOrden =  tipoUbicacionLineaOrden ;
              $scope.ciudad = ciudad  ; 
               $scope.prodCli  ={};
             
     

              $scope.lineasProductoAlternos = false ; 
              $scope.lineasBodegaAlternos = false ; 
              $scope.lineasCiudadAlternos = false ; 
              $scope.lineasUnidadAlternos = false ; 
              if($scope.esEdicion === 0 )
              { 
                    console.log("Agregar un producto  nuevo");
                    $scope.jsonProductoAdd.producto = "";
                    $scope.jsonProductoAdd.bodega ="" ;
                    $scope.jsonProductoAdd.cantidad = "";
                    $scope.jsonProductoAdd.unidad = "";
                    $scope.jsonProductoAdd.lote ="";
                    $scope.jsonProductoAdd.notas  ="";
                    $scope.jsonProductoAdd.alto = "";
                    $scope.jsonProductoAdd.largo = "";
                    $scope.jsonProductoAdd.ancho = "";
                    $scope.jsonProductoAdd.volumen = "";
                    $scope.jsonProductoAdd.total = "";
                    $scope.jsonProductoAdd.pesoBruto  ="";
                    $scope.jsonProductoAdd.totalKilos = "";
                    $scope.jsonProductoAdd.pesoVolumetrico = "";
                    $scope.jsonProductoAdd.totalVolumen = "";
                    $scope.jsonProductoAdd.valorDeclarado ="";
                    $scope.jsonProductoAdd.totalDeclarado = "";
                    $scope.jsonProductoAdd.codigoProducto  ="" ;
                    $scope.jsonProductoAdd.nombreBodega = ""; 
                    $scope.jsonProductoAdd.codigoBodega = "";
                    $scope.jsonProductoAdd.numeroItem = "";
              


              }else{
                    $scope.lineasProductoAlternos = false ; 
                    $scope.lineasBodegaAlternos = false ; 
                    $scope.lineasCiudadAlternos = false ; 
                    $scope.lineasUnidadAlternos = false ; 

                    if(ciudadNombreAlterno != null  ||  ciudadNombreAlterno != ''){
                        $scope.lineasCiudadAlternos = false ; 
                    }else{
                        $scope.lineasCiudadAlternos = true ; 
                    }

                    if(codigoBodegaAlterno != null || codigoBodegaAlterno != '' || 
                      nombreBodegaAlterno != null || nombreBodegaAlterno != '' ){
                        $scope.lineasBodegaAlternos = false ;
                    }else{
                        $scope.lineasBodegaAlternos = true ;
                    }

                    if(codigoProductoAlterno != null || codigoProductoAlterno != '' ||
                      nombreProductoAlterno != null || nombreProductoAlterno != ''){
                        $scope.lineasProductoAlternos = false ; 
                    }else{
                        $scope.lineasProductoAlternos = true; 
                    }

                    if(codigoUnidadAlterno != null || codigoUnidadAlterno != ''){
                      $scope.lineasUnidadAlternos = false ; 
                    }else{
                      $scope.lineasUnidadAlternos = true ; 
                    }



                    $scope.idLineaOrden  =  idLineaOrden  ; 
                    $scope.jsonProductoAdd.producto = producto;
                    $scope.jsonProductoAdd.bodega =bodega ;
                    $scope.jsonProductoAdd.cantidad = cantidad;
                    $scope.jsonProductoAdd.unidad = idUnidadMedidaEdicion;
                    $scope.jsonProductoAdd.lote =lote;
                    $scope.jsonProductoAdd.notas  =notas;
                    $scope.jsonProductoAdd.alto = alto;
                    $scope.jsonProductoAdd.largo = largo;
                    $scope.jsonProductoAdd.ancho = ancho;                    
                    $scope.jsonProductoAdd.pesoBruto  =pesoBruto;                    
                    $scope.jsonProductoAdd.valorDeclarado =valorDeclarado;
                    $scope.jsonProductoAdd.codigoProducto = codigoProducto ;
                    $scope.jsonProductoAdd.numeroItem = numeroItem ;

                    $scope.prodCli.selectedItem ={}                    
                    $scope.prodCli.selectedItem.nombre  = producto +","+ nombreProducto;
                    $scope.prodCli.selectedItem.id = idProductoEdit;
                   console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ciudades-x-producto?id_producto='+$scope.prodCli.selectedItem.id)
                    $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ciudades-x-producto?id_producto='+$scope.prodCli.selectedItem.id)
                        .success(function(data, status, headers, config){
                          //alert("**** SUCCESS ****");
                         // alert(status);

                        })
                        .error(function(data, status, headers, config){
                            console.log("error ===>");
                            console.log(status);
                            console.log(data);
                            console.log(headers);
                            console.log(config);
                      
                        })
                        .then(function(response){
                         
                         $scope.ciudadesProducto= response.data;
                         console.log("Ciudades para crear productos ");
                         console.log($scope.ciudadesProducto) ; 

                    });   
                     $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/unidades-x-producto?id_producto='+$scope.prodCli.selectedItem.id)
                            .success(function(data, status, headers, config){
                              //alert("**** SUCCESS ****");
                             // alert(status);

                            })
                            .error(function(data, status, headers, config){
                                 console.log("error ===>");
                                  console.log(status);
                                  console.log(data);
                                  console.log(headers);
                                  console.log(config);
                          
                            })
                            .then(function(response){
                             
                             $scope.unidadesProducto= response.data;
                            console.log("json cargado unidades producto ===> " );                            
                             console.log($scope.unidadesProducto) ; 

                    });        


                    console.log("Editar un producto existente ==>"  + $scope.idLineaOrden);


              }
              $scope.muestraAgrega =  false;
                $scope.showNuevoProducto = function(){
                      if($scope.muestraAgrega){
                        $scope.muestraAgrega =  false;

                      }else{
                        $scope.muestraAgrega =  true;
                      }
                     


                }

                $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)
                  .success(function(data, status, headers, config){
                    //alert("**** SUCCESS ****");
                   // alert(status);

                  })
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                
                  })
                  .then(function(response){
                   
                   $scope.productosCliente= response.data;
                  console.log("json cargado productos ===> " );
                  console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio);

                   console.log($scope.productosCliente) ; 

              });    
                /**************************Carga unidades por producto*************************************************/
            $scope.cargaUnidades = function (){
             console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto); 
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesProducto= response.data;
                    console.log("json cargado unidades producto ===> " );
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'satelite/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto);

                     console.log($scope.unidadesProducto) ; 

                });    
            }


            /**************************Carga bodegas a partir de un producto*************************************************/
            $scope.cargaBodegas = function (){
              console.log("carga bodegas");
            console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/bodegas-x-producto-x-ciudad?id_producto='+$scope.jsonProductoAdd.producto+'&id_ciudad='+$scope.jsonProductoAdd.ciudad)
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/bodegas-x-producto-x-ciudad?id_producto='+$scope.jsonProductoAdd.producto+'&id_ciudad='+$scope.jsonProductoAdd.ciudad)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.bodegasProducto= response.data;
                   //  $scope.jsonProductoAdd.nombre = item.attributes["data-nombre"].value;

                    //console.log("json cargado bodegas ===> " + item.attributes["data-nombre"].value );
                    //console.log(item.currentTarget.getAttribute("data-nombre"));
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'satelite/ordenes/bodegas-x-producto?id_producto='+$scope.jsonProductoAdd.producto+'&id_ciudad='+$scope.jsonProductoAdd.ciudad);
                      console.log("carga bodegas producto =>");
                     console.log($scope.bodegasProducto) ; 

                });    
                 $scope.cargaUnidades();   
            }
            /*******************Carga  datos de la  bodega **************************************/
            $scope.cargaDatosBodega  = function (){
                for (var i = 0; i < $scope.bodegasProducto.length; i++) {
                     if(parseInt($scope.bodegasProducto[i].id)  === parseInt($scope.jsonProductoAdd.bodega)){

                        $scope.jsonProductoAdd.codigoBodega = $scope.bodegasProducto[i].codigo;
                        $scope.jsonProductoAdd.nombreBodega = $scope.bodegasProducto[i].nombre;
                     }
                }

            }

             /**************************Carga bodegas a partir de un producto*************************************************/
            $scope.mostrarCantidadDisponible  = 0 ;
            $scope.cargaCiudadesProducto = function (val){
              console.log("prodCli");
              console.log($scope.prodCli.selectedItem);
              $scope.jsonProductoAdd.producto = val;
              for (var i = 0; i <  $scope.productosCliente.length; i++) {

                 if(parseInt($scope.jsonProductoAdd.producto) === parseInt($scope.productosCliente[i].id) ){
                        console.log("nombre => "+$scope.productosCliente[i].nombre);
                        console.log("nombre largo  => "+$scope.productosCliente[i].nombreLargo);
                        $scope.jsonProductoAdd.codigoProducto = $scope.productosCliente[i].codigo;
                        $scope.jsonProductoAdd.nombreProducto = $scope.productosCliente[i].nombre;
                        $scope.jsonProductoAdd.codigoProductoAlterno = $scope.productosCliente[i].codigoAlterno;
                        $scope.jsonProductoAdd.nonbreProductoAlterno = $scope.productosCliente[i].nombreLargo;

                 }
              }
             console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ciudades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ciudades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                        console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.ciudadesProducto= response.data;
                     console.log("Ciudades para crear productos ");
                     console.log($scope.ciudadesProducto) ; 
                      

                });    
                 $scope.cargaUnidades();   
            }
              /**************************Carga  unidad cliente apartir de unidad*************************************************/
        
            $scope.mostrarMedidasProducto = 0;
            $scope.cantidadDisponible = "n/a";
            $scope.cargaUnidadesCliente = function (valor){

              console.log("entra cargue cliente unidadad  =="  +valor );
                  for (var i = 0 ; i < $scope.unidadesProducto.length; i++) {
                      if(parseInt($scope.unidadesProducto[i].id) === parseInt($scope.jsonProductoAdd.unidad)){
                          $scope.jsonProductoAdd.unidadCliente = $scope.unidadesProducto[i].nombreAlterno ; 
                          $scope.jsonProductoAdd.alto  = $scope.unidadesProducto[i].alto ; 
                          $scope.jsonProductoAdd.largo = $scope.unidadesProducto[i].largo; 
                          $scope.jsonProductoAdd.ancho  = $scope.unidadesProducto[i].ancho ; 
                          $scope.jsonProductoAdd.volumen =  $scope.jsonProductoAdd.alto * $scope.jsonProductoAdd.ancho * $scope.jsonProductoAdd.largo;
                          $scope.jsonProductoAdd.total =  $scope.jsonProductoAdd.volumen *  $scope.jsonProductoAdd.cantidad;
                          $scope.jsonProductoAdd.pesoBruto =  $scope.unidadesProducto[i].pesoBruto;
                          $scope.jsonProductoAdd.pesoVolumetrico  =   $scope.jsonProductoAdd.pesoBruto  *  $scope.jsonProductoAdd.volumen;
                          $scope.jsonProductoAdd.totalKilos=  $scope.jsonProductoAdd.pesoBruto *  $scope.jsonProductoAdd.cantidad;
                          $scope.jsonProductoAdd.totalVolumen  = $scope.jsonProductoAdd.pesoVolumetrico *  $scope.jsonProductoAdd.cantidad;
                          $scope.jsonProductoAdd.totalDeclarado =  $scope.jsonProductoAdd.totalVolumen + $scope.jsonProductoAdd.totalKilos + $scope.jsonProductoAdd.total ;
                          $scope.mostrarMedidasProducto = 1;
                          $scope.mostrarCantidadDisponible  = 1 ;


                            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/serviciosTactic/consultaDisponibles')
                                  .success(function(data, status, headers, config){                                  
                                  })
                                  .error(function(data, status, headers, config){
                                    console.log("error ===>");
                                    console.log(status);
                                    console.log(data);
                                    console.log(headers);
                                    console.log(config);                                
                                  })
                                  .then(function(response){
                                   
                                   $scope.respuestaDisponible =response.data; 
                                   $scope.cantidadDisponible = $scope.respuestaDisponible.cantidad ;
                                   console.log("canitdad disponibles"); 
                                   console.log($scope.cantidadDisponible);
                              });    

                      }
                  }      
            }

             $scope.destino = [];
        $scope.cargaDestinosEnvio = function (){
            console.log("entra cargar destinos envio ");
            console.log("")
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonProductoAdd.ciudad+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $rootScope.destino= response.data;
               console.log("json cargado destino ===> " );
               console.log($scope.destino) ; 

          });    

        }           
            $scope.cerrarModal = function (){

                $mdDialog.hide();
            }
            $scope.campoValidacionNuevaLinea = "";
            $scope.faltanDatosNuevaLinea = false ;
            $scope.validarDataNuevaLinea = function (){
              
              if($scope.jsonProductoAdd.cantidad === null  || $scope.jsonProductoAdd.cantidad === ""  ){
                  $scope.campoValidacionNuevaLinea = "Cantidad";
                  $scope.faltanDatosNuevaLinea = true;
                  return;
              }else if ($scope.jsonProductoAdd.unidad === null ||  $scope.jsonProductoAdd.unidad === ""){
                  $scope.campoValidacionNuevaLinea = "Unidad";
                  $scope.faltanDatosNuevaLinea = true;
                  return;

              }else{
                $scope.agregarProductoTemporal();

              }



            }
          
            $scope.agregarProductoTemporal = function (){

              //var dataPreview = document.getElementById('productoLista');
              //$scope.lista.nombre = dataPreview.getAttribute("data-nombre");


              //console.log("valor = " + $attrs.nombre);
                       /* datatableData =  datatableData.concat([
                                                    {
                                                      "producto":$scope.lista.nombre, 
                                                      "bodega":54456744 ,
                                                       "cantidad" : 10  ,
                                                       "unidad"  : "Bu" , 
                                                       "lote":"123423",
                                                       "notas" :"texto"
                                                    }
                                                ]);*/

                                //Init the datatable with his configuration
        //$scope.datatable = datatable(datatableConfig);
        //Set the data to the datatable
        //$scope.datatable.setData(datatableData);
         console.log("data entrega en modal ");
         console.log($scope.jsonEntregaRetorno);
 alert( "producto es = " + $scope.jsonProductoAdd.producto);
          $scope.jsonEntregaProducto=  [{

                                             idLineaOrden:$scope.idLineaOrden,
                                             idOrden :parseInt($scope.ordenSeleccionada.idOrden),
                                             numeroItem : parseInt($scope.jsonProductoAdd.numeroItem),
                                             producto : parseInt($scope.jsonProductoAdd.producto), 
                                             codigoProducto :$scope.jsonProductoAdd.codigoProducto ,
                                             nombreProducto : $scope.jsonProductoAdd.nombreProducto , 
                                             codigoProductoAlterno : $scope.jsonProductoAdd.codigoProductoAlterno , 
                                             nombreProductoAlterno : $scope.jsonProductoAdd.nombreProductoAlterno, 
                                             cantidad :parseInt($scope.jsonProductoAdd.cantidad),
                                             unidad : parseInt($scope.jsonProductoAdd.unidad),
                                             codigoUnidad : $scope.jsonProductoAdd.codigoUnidad ,
                                             nombreUnidad: $scope.jsonProductoAdd.codigoUnidadAlterno,
                                             codigoUnidadAlterno : $scope.jsonProductoAdd.codigoUnidadAlterno,
                                             bodega :parseInt($scope.jsonProductoAdd.bodega),
                                             codigoBodega: $scope.jsonProductoAdd.codigoBodega ,
                                             nombreBodega : $scope.jsonProductoAdd.nombreBodega, 
                                             //codigoBodegaAlterno :$scope.jsonProductoAdd.codigoBodegaAlterno ,
                                             //nombreBodegaAlterno : $scope.jsonProductoAdd.nombreBodegaAlterno, 
                                             lote :$scope.jsonProductoAdd.lote,
                                             notas :$scope.jsonProductoAdd.notas,
                                             idUsuario:parseInt($scope.login.id),
                                             usuario:$scope.login.usuario ,
                                             valorDeclaradoPorUnidad : $scope.jsonProductoAdd.valorDeclarado

                                        }];
        console.log("jsonEntregaProducto  data  =>");
        console.log(angular.toJson($scope.jsonEntregaProducto, true));

        console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
        $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
              
              
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);

              })
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
              
              $scope.jsonProductoRetorno= response.data;
              console.log("Data");
              console.log($scope.jsonProductoRetorno) ; 
                if ($scope.jsonProductoRetorno.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonProductoRetorno.mensajes.mensajes[0].texto )

                 }else{
                       //$scope.imprimir();
                       console.log("json cargado retorno  productos ===> ");
                       console.log($scope.jsonProductoRetorno.orden.lineas);

                        for (var i = 0; i < $scope.jsonProductoRetorno.orden.lineas.length; i++) {
                  
                               if($scope.jsonProductoRetorno.orden.lineas[i].valorDeclaradoPorUnidad  !=  null){
                                  $rootScope.mostrarValorDeclarado = false;

                               }

                            }
                            if($rootScope.mostrarValorDeclarado){
                              console.log("NO hay valor declarado en ninguna linea");
                            }else{
                              console.log("Ya existe un valor declarado en la linea")

                            }



                       $rootScope.contarProductosPorUnidad($scope.jsonProductoRetorno.orden.lineas);
                       

                       for (var i = 0; i < $scope.jsonProductoRetorno.orden.lineas.length ; i++) {
                          $scope.cantidadTotal += $scope.jsonProductoRetorno.orden.lineas[i].cantidad ; 
                       }
                       console.log("cantidad total  = " + $scope.cantidadTotal);

                       $scope.gridOptions.data = [];
                       $scope.gridOptions.data = $scope.jsonProductoRetorno.orden.lineas;
                          /* $scope.gridOptions.columnDefs[0].visible = false;
                            $scope.gridOptions.columnDefs[1].visible = false;
                            $scope.gridOptions.columnDefs[2].visible = false;
                            $scope.gridOptions.columnDefs[3].visible = false;
                            $scope.gridOptions.columnDefs[4].visible = false;*/

                          $mdDialog.hide();
                          $scope.jsonProductoAdd.producto = "";
                          $scope.jsonProductoAdd.bodega ="" ;
                          $scope.jsonProductoAdd.cantidad = "";
                          $scope.jsonProductoAdd.unidad = "";
                          $scope.jsonProductoAdd.lote ="";
                          $scope.jsonProductoAdd.notas  ="";
              }
             // $scope.idLineaOrden =  $scope.jsonProductoRetorno.lineaOrden.idlineaOrden;
               //console.log("json cargado retorno  productos ===> "  +  $scope.idLineaOrden  );
              //$scope.gridOptions.data = [] ;
              //$scope.gridOptions.data = $scope.jsonProductoRetorno.orden.lineas ;
                //$scope.dataTabs.tabEnvio = false;
               //$scope.dataTabs.tabSeleccionada =1; 

             });                           
       }
  }

        $scope.mostrarMensajeEdicionExitosa  = function(ev) {
                
                  $mdDialog.show(
                    $mdDialog.alert()
                      .parent(angular.element(document.querySelector('#popupContainer')))
                      .clickOutsideToClose(true)
                      .title('informacion')
                      .textContent('Se ha guardado la orden correctamente')
                      .ariaLabel('Mensaje')
                      .ok('OK')
                      .targetEvent(ev)
                 );
              };

      $scope.jsonEdicion = [];
      $scope.finalizarEdicion = function(){
          console.log("valor " +  parseInt($scope.data.info) ) ; 
          if(parseInt($scope.data.info) === 0 ){
                $scope.jsonEntrega.fechaMaxima =   $scope.jsonEntrega.fechaMaxima;
                $scope.jsonEntrega.fechaMinima =  $scope.jsonEntrega.fechaMaxima;

          }
          if(parseInt($scope.data.info) === 1 ){
                $scope.jsonEntrega.fechaMaxima =   $scope.jsonEntrega.fechaMaxima;
                $scope.jsonEntrega.fechaMinima =  $scope.jsonEntrega.fechaMinima;

          }
          if(parseInt($scope.data.info) === 3 ){
                $scope.jsonEntrega.fechaMaxima =  null;
                $scope.jsonEntrega.fechaMinima =  null;

          }

          $scope.jsonEdicion = { 
                                  idOrden: parseInt($scope.ordenSeleccionada.idOrden),
                                  datosFacturacion :$scope.jsonFacturacion,
                                  destinoOrigen : $scope.jsonEnvio,
                                  destinoOrigenBodega : $scope.jsonEnvioShipTo,
                                  datosEntregaRecogida  :$scope.jsonEntrega,
                                  datosOtros: $scope.jsonOtros,
                                  lineas : $scope.lineas ,
                                  usuarioActualizacion:$scope.login.usuario,
                                  idUsuarioActualizacion : parseInt($scope.login.id),
                                  nuevoEstadoOrden :$scope.jsonFacturacion.estadoOrdenType
                                 };
          console.log("Json envio edicion");
          console.log(angular.toJson($scope.jsonEdicion, true));
          console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/save',$scope.jsonEdicion);
           $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/save',$scope.jsonEdicion)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.edicionRetorno= response.data;
                    console.log("json edicion retorno ===> " );
                    console.log(angular.toJson($scope.edicionRetorno, true));
                     if ($scope.edicionRetorno.mensajes.severidadMaxima != 'INFO') {
                      alert("error" + $scope.edicionRetorno.mensajes.mensajes[0].texto )

                      }else{
                          $scope.mostrarMensajeEdicionExitosa();
                      }

                });    

      }

  $scope.jsonAceptacion = [];
      $scope.finalizarAceptacion = function(){
        if($scope.jsonFacturacion.numeroDocumentoOrdenCliente === undefined || 
          $scope.jsonFacturacion.numeroDocumentoOrdenCliente === null    ||
          $scope.jsonFacturacion.numeroDocumentoOrdenCliente === ""){
          console.log("falta numero de documento");
          alert("Se debe agregar numero de documento que acompaña la orden !!!");

        }else{
          console.log("ya tiene numero de documento");
          $scope.jsonAceptacion = { 
                                 idOrden: parseInt($scope.ordenSeleccionada.idOrden),
                                  datosFacturacion :$scope.jsonFacturacion,
                                  destinoOrigen : $scope.jsonEnvio,
                                  destinoOrigenBodega : $scope.jsonEnvioShipTo,
                                  datosEntregaRecogida  :$scope.jsonEntrega,
                                  datosOtros: $scope.jsonOtros,
                                  lineas : $scope.lineas ,
                                  usuarioActualizacion:$scope.login.usuario,
                                  idUsuarioActualizacion : parseInt($scope.login.id),                                 
                                  nuevoEstadoOrden :"ACEPTADA"
                                 };
          console.log("Json envio ACEPTACION");
          console.log(angular.toJson($scope.jsonAceptacion, true));
          console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/save',$scope.jsonAceptacion);
           $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/save',$scope.jsonAceptacion)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.aceptacionRetorno= response.data;
                    console.log("json edicion retorno ===> " );
                    console.log(angular.toJson($scope.aceptacionRetorno, true));
                     if ($scope.aceptacionRetorno.mensajes.severidadMaxima != 'INFO') {
                      alert("error" + $scope.aceptacionRetorno.mensajes.mensajes[0].texto )

                      }else{
                          $scope.mostrarMensajeEdicionExitosa();
                      }

                });    
        }
          
      }

       $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
       $scope.showAdvancedMensajes = function(ev) {
        

          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerMensajes,
            templateUrl: './ordenesVenta/mensajesServidor.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                      jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion,
                       mensajesServidor : $scope.mensajesServidor

                     }
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };

        function DialogCotrollerMensajes($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ,mensajesServidor) 
        {
             $scope.mensajesServidor = mensajesServidor;

             console.log("entra controlador mensajes ");
             console.log($scope.mensajesServidor);

               $scope.cerrarModal = function (){
                  $mdDialog.hide();
              }
             
        }


          $scope.showNuevoProducto = function(ev) {
        

          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerNuevoProducto,
            templateUrl: './ordenesVenta/agregarNuevoProducto.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                       jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       ordenSeleccionada :$scope.ordenSeleccionada,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion,
                       cantidadTotal:$scope.cantidadTotal,
                      tipoUbicacionLineaOrden: $scope.tipoUbicacionLineaOrden , 
                      ciudad : $scope.ciudad ,
                      productosCliente : $scope.productosCliente
                     }
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };

        function DialogCotrollerNuevoProducto($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ,ordenSeleccionada , productosCliente) 
        {
             //$scope.mensajesServidor = mensajesServidor;
                $scope.login = login ; 
              $scope.serverData =serverData;
              $scope.jsonFacturacion = jsonFacturacion;
              $scope.datatable = []
              $scope.productosTemporales  = productosTemporales;
              $scope.imprimir   =  imprimir;
              $scope.datatable = tabla;
              $scope.jsonProductoAdd = [];
              $scope.jsonProductoAdd.disponible = 275;
              $scope.jsonEntregaRetorno = jsonEntregaRetorno;
              $scope.jsonEntregaProducto = [];              
              $scope.ordenSeleccionada = ordenSeleccionada ;
              $scope.productosCliente = [];
              $scope.productosCliente = productosCliente;
              console.log("productos");
              console.log($scope.productosCliente);

              $scope.jsonNiveles = []
              $scope.jsonNivel1 = {};
              $scope.jsonNivel1.factorConversion = 1 ; 
              $scope.jsonNivel2 = {};
              $scope.jsonNivel3 = {};
              $scope.campoValidacion = "";
              $scope.jsonDataProducto = {};
              $scope.faltanDatos = false;


              $scope.mostrarMensajeDatosFaltantes = function(ev) {
                
                  $mdDialog.show(
                    $mdDialog.alert()
                      .parent(angular.element(document.querySelector('#popupContainer')))
                      .clickOutsideToClose(true)
                      .title('informacion')
                      .textContent('El campo '+ $scope.campoValidacion +" es obligatorio." )
                      .ariaLabel('Mensaje')
                      .ok('Got it!')
                      .targetEvent(ev)
                 );
              };
              $scope.validar = function (){
                  if($scope.jsonDataProducto.codigoAlterno === undefined){
                  
                         $scope.campoValidacion = "Codigo producto";
                          $scope.faltanDatos = true;

                    //     $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDataProducto.nombreProductoAlterno === undefined){
                         
                         $scope.campoValidacion = "Nombre producto";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.codigoUnidadAlterno === undefined){
                         
                         $scope.campoValidacion = "Unidad cliente";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.unidadId === undefined){
                         
                         $scope.campoValidacion = "Unidad";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.volumen === undefined){
                         
                         $scope.campoValidacion = "Volumen";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.pesoVolumetrico === undefined){
                         
                         $scope.campoValidacion = "Peso volumetrico";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else{

                    $scope.crearNuevo();
                    //console.log("llamar crear ");
                  }
                  


              }  






              $scope.cerrarModal = function (){
                  $mdDialog.hide();
              }


               $scope.mostrarMensajeCreacionProductoExitosa = function(ev) {
                
                  $mdDialog.show(
                    $mdDialog.alert()
                      .parent(angular.element(document.querySelector('#popupContainer')))
                      .clickOutsideToClose(true)
                      .title('informacion')
                      .textContent('Se ha creado el producto correctamente.')
                      .ariaLabel('Mensaje')
                      .ok('OK')
                      .targetEvent(ev)
                 );
              };
              $scope.crearNuevo = function (){
                $scope.jsonNiveles = [
                                      $scope.jsonNivel1,
                                      $scope.jsonNivel2,
                                      $scope.jsonNivel3
                                     ];

                                
                console.log("json de  nuevo producto")
              //  console.log(angular.toJson($scope.jsonNiveles, true));
                $scope.dataNuevoProducto = {
                                              clienteId :  $scope.jsonFacturacion.cliente,
                                              codigoAlterno : $scope.jsonDataProducto.codigoAlterno ,
                                              nombreAlterno: $scope.jsonDataProducto.nombreProductoAlterno,
                                              valorAproximado : $scope.jsonNivel1.valorDeclarado,
                                              provisional :true ,
                                              usuarioActualizacion :  $scope.login.usuario,                                              
                                              unidadNivel1 :$scope.jsonNivel1 ,
                                              unidadNivel2: $scope.jsonNivel2 ,
                                              unidadNivel3 :$scope.jsonNivel3 
                                            };
              console.log(angular.toJson($scope.dataNuevoProducto, true));
               $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/productos/save' , $scope.dataNuevoProducto)
                    .success(function(data, status, headers, config){
                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                          $scope.respuesta= response.data;
                           console.log("respuesta ==>");
                           console.log($scope.respuesta);
                     
                     
                       if ($scope.respuesta.mensajes.severidadMaxima != 'INFO') {
                            alert("error" + $scope.respuesta.mensajes.mensajes[0].texto )

                           }else{
                           
                           $scope.cerrarModal();
                           $scope.mostrarMensajeCreacionProductoExitosa();
                      }

                });   

              }


              /*******************carga de productos para hacer copia ***********************************/
              console.log("beer");
             console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)
                $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)

                  .success(function(data, status, headers, config){
                    //alert("**** SUCCESS ****");
                   // alert(status);

                  })
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                
                  })
                  .then(function(response){
                   
                   $scope.productosCliente= response.data;
                  console.log("json cargado productos ===> " );
                  

                   console.log($scope.productosCliente) ; 

              });   
              /**************************************************************/
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/productos/unidades-x-nivel?nivel=1')
                    .success(function(data, status, headers, config){
                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesNivel1= response.data;
                     console.log("Nivel 1");
                     console.log($scope.unidadesNivel1);
                     

                });   
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/productos/unidades-x-nivel?nivel=2')
                    .success(function(data, status, headers, config){
                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesNivel2= response.data;
                     console.log("Nivel 2");
                     console.log($scope.unidadesNivel2);
                     

                });   

             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/productos/unidades-x-nivel?nivel=3')
                    .success(function(data, status, headers, config){
                    })
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesNivel3= response.data;
                     console.log("Nivel 3");
                     console.log($scope.unidadesNivel3);
                     

                });   
             
             $scope.calculaVolumenNivel1= function (){
                          $scope.jsonNivel1.alto    = $scope.jsonNivel1.alto; 
                          $scope.jsonNivel1.largo   = $scope.jsonNivel1.largo; 
                          $scope.jsonNivel1.ancho   = $scope.jsonNivel1.ancho; 
                          $scope.jsonNivel1.volumen = $scope.jsonNivel1.alto * $scope.jsonNivel1.ancho * $scope.jsonNivel1.largo;                            
              
                        
             }
             $scope.calcularPesoVolumetricoNivel1 = function (){
                            $scope.jsonNivel1.pesoVolumetrico  =   $scope.jsonNivel1.pesoBruto  *  $scope.jsonNivel1.volumen;

             }
             $scope.calculaVolumenNivel2= function (){
                          $scope.jsonNivel2.alto    = $scope.jsonNivel2.alto; 
                          $scope.jsonNivel2.largo   = $scope.jsonNivel2.largo; 
                          $scope.jsonNivel2.ancho   = $scope.jsonNivel2.ancho; 
                          $scope.jsonNivel2.volumen = $scope.jsonNivel2.alto * $scope.jsonNivel2.ancho * $scope.jsonNivel2.largo;                            
              
                        
             }
             $scope.calcularPesoVolumetricoNivel2 = function (){
                            $scope.jsonNivel2.pesoVolumetrico  =   $scope.jsonNivel2.pesoBruto  *  $scope.jsonNivel2.volumen;

             }

              $scope.calculaVolumenNivel3= function (){
                          $scope.jsonNivel3.alto    = $scope.jsonNivel3.alto; 
                          $scope.jsonNivel3.largo   = $scope.jsonNivel3.largo; 
                          $scope.jsonNivel3.ancho   = $scope.jsonNivel3.ancho; 
                          $scope.jsonNivel3.volumen = $scope.jsonNivel3.alto * $scope.jsonNivel3.ancho * $scope.jsonNivel3.largo;                            
              
                        
             }
             $scope.calcularPesoVolumetricoNivel3 = function (){
                          $scope.jsonNivel3.pesoVolumetrico  =   $scope.jsonNivel3.pesoBruto  *  $scope.jsonNivel3.volumen;

             }

               console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/ciudades');
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/ciudades')
                  .success(function(data, status, headers, config){
                  })
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);                  
                  })
                  .then(function(response){
                   
                   $scope.ciudades= response.data;
                   console.log("ciudades =>");
                   console.log($scope.ciudades);
                   
              });   
       }



        /************************ventan modal para   destino origen ********************/
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
       $scope.showDestinoOrigen = function(ev) {
        

          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerDestinoOrigen,
            templateUrl: './ordenesVenta/agregarDestinoOrigen.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                       jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion,
                       mensajesServidor : $scope.mensajesServidor,
                        ordenSeleccionada :$scope.ordenSeleccionada,
                        origenDestinoTitulo :$scope.origenDestinoTitulo

                     }
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };

        function DialogCotrollerDestinoOrigen($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ,ordenSeleccionada ,origenDestinoTitulo ,  $rootScope ) 
        {
              $scope.login = login ; 
              $scope.serverData =serverData;
              $scope.jsonFacturacion = jsonFacturacion;
              $scope.datatable = []
              $scope.productosTemporales  = productosTemporales;
              $scope.imprimir   =  imprimir;
              $scope.datatable = tabla;
              $scope.jsonProductoAdd = [];
              $scope.jsonProductoAdd.disponible = 275;
              $scope.jsonEntregaRetorno = jsonEntregaRetorno;
              $scope.jsonEntregaProducto = [];              
              $scope.ordenSeleccionada = ordenSeleccionada ;
              $scope.jsonDestinoOrigen = {};
              $scope.origenDestinoTitulo = origenDestinoTitulo; 
              

             console.log("entra controlador destino origen  ");
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/segmentos-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente)
                  .success(function(data, status, headers, config){
                  })
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);                  
                  })
                  .then(function(response){
                   
                   $scope.segmentosDestinoOrigen= response.data;
                   console.log("Segementos =>");
                   console.log($scope.segmentosDestinoOrigen);
                   

              });   
            
             $scope.cargarDestinatario = function (){
              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/destinatarios_remitentes-x-cliente-x-segmento?id_cliente='+$scope.jsonFacturacion.cliente+'&id_segmento='+$scope.jsonDestinoOrigen.segmentoId);
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/destinatarios_remitentes-x-cliente-x-segmento?id_cliente='+$scope.jsonFacturacion.cliente+'&id_segmento='+$scope.jsonDestinoOrigen.segmentoId)
                  .success(function(data, status, headers, config){
                  })
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);                  
                  })
                  .then(function(response){
                   
                   $scope.destinatarioOrigen= response.data;
                   console.log("destinatarios =>");
                   console.log($scope.destinatarioOrigen);
                   

              });   
             }

        
              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/ciudades');
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/ciudades')
                  .success(function(data, status, headers, config){
                  })
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);                  
                  })
                  .then(function(response){
                   
                   $scope.ciudades= response.data;
                   console.log("ciudades =>");
                   console.log($scope.ciudades);
                   
              });   

             $scope.setDestinatario = function (id){

                $scope.jsonDestinoOrigen.destinatarioRemitenteId = id ;

             }
             $scope.setCiudad = function (id){
                $scope.jsonDestinoOrigen.ciudadId = id ; 

             }
             $scope.cerrarModal = function(){
                console.log("entra");
                $mdDialog.hide()

               }
                $scope.faltanDatosShip = false ;
                $scope.validarCreacion = function (){
                 if($scope.jsonFacturacion.destinatario === undefined){
                  
                         $scope.campoValidacionDestinoShip = "Destinatario";
                          $scope.faltanDatosShip = true;

                    //     $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinoOrigen.ciudadId === undefined){
                         
                         $scope.campoValidacionDestinoShip = "Ciudad";
                         $scope.faltanDatosShip = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinoOrigen.direccion === undefined){
                         
                         $scope.campoValidacionDestinoShip = "Dirección";
                         $scope.faltanDatosShip = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else{

                    $scope.crearDestinatario();
                    //console.log("llamar crear ");
                  }              
              }

             $scope.crearDestinatario  = function (){
                   $scope.nuevoDestinatario = {
                                              //clienteId :   $scope.jsonFacturacion.cliente,
                                              //segmentoId :  $scope.jsonDestinoOrigen.segmentoId ,
                                              destinatarioRemitenteId: $scope.jsonFacturacion.destinatario,
                                              codigo : $scope.jsonDestinoOrigen.codigo,
                                              nombre :$scope.jsonDestinoOrigen.nombre ,
                                              ciudadId :  parseInt($scope.jsonDestinoOrigen.ciudadId),
                                              direccion : $scope.jsonDestinoOrigen.direccion,
                                              indicacionesDireccion : $scope.jsonDestinoOrigen.indicaciones,
                                              contactoNombres : $scope.jsonDestinoOrigen.nombres,
                                              contactoEmail : $scope.jsonDestinoOrigen.email,
                                              contactoTelefonos: $scope.jsonDestinoOrigen.telefono,
                                              usuarioActualizacion :  $scope.login.usuario,
                                            };
                  console.log("json envio destinatario  =>");
                  console.log(angular.toJson($scope.nuevoDestinatario, true));
                   console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/save',$scope.nuevoDestinatario);                         
                  $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/destinos_origenes/save',$scope.nuevoDestinatario)
                        .success(function(data, status, headers, config){
                        })
                        .error(function(data, status, headers, config){
                             console.log("error ===>");
                              console.log(status);
                              console.log(data);
                              console.log(headers);
                              console.log(config);                  
                        })
                        .then(function(response){
                         
                         $scope.respuesta= response.data;
                         console.log("respuesta =>");
                         console.log($scope.respuesta);
                        
                          if ($scope.respuesta.mensajes.severidadMaxima != 'INFO') {
                            alert("error" + $scope.respuesta.mensajes.mensajes[0].texto )

                           }else{
                             
                               $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
                                            .success(function(data, status, headers, config){
                                              //alert("**** SUCCESS ****");
                                             // alert(status);

                                            })
                                            .error(function(data, status, headers, config){
                                                 console.log("error ===>");
                                              console.log(status);
                                              console.log(data);
                                              console.log(headers);
                                              console.log(config);
                                          
                                            })
                                            .then(function(response){
                                             
                                              $scope.ciudad= response.data;
                                              $rootScope.ciudad= [];
                                              $rootScope.ciudad= $scope.ciudad ;
                                              $scope.cerrarModal();
                                             console.log("json cargado ciudad ===> ");
                                             console.log($scope.ciudad);
                                        

                              });       
                          }                       
                   });  
             }
        }
}]);
		