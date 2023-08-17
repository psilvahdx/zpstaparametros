sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/ui/model/json/JSONModel",	
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	'sap/ui/export/Spreadsheet',
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, MessageBox, MessageToast, Spreadsheet, Fragment) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.Fechamento", {
		onInit: function () {
			
			//Recuperando registros para a tabela
			var oModelFechamento = new sap.ui.model.json.JSONModel();			
			this.getView().setModel(oModelFechamento, "oModelFechamento");
			this.getView().setModel(oModelFechamento, "oModelExport");
			this.getView().setModel(this.createAddModel(), "oModelAdd");
			this.getView().setModel(this.createUpdModel(), "oModelUpd");
			
		}, 
		
		createAddModel: function(){
			var oModelAdd = new sap.ui.model.json.JSONModel({
				Empresa: "", CodEveNegocio: "", Ano: "", Mes: "", DataInclusao: new Date(), HoraInclusao: "", Mes01: false, Mes02: false, 
				Mes03: false, Mes04: false, Mes05: false, Mes06: false, Mes07: false, Mes08: false, Mes09: false, Mes10: false, Mes11: false, Mes12: false,				
				UsuarioCriacao: "NAODEFINIDO"
			});
			
			return oModelAdd;
		},
		
		createUpdModel: function(){
			var oModelUpd = new sap.ui.model.json.JSONModel({
				Empresa: "", CodEveNegocio: "", Ano: "", Mes: "", DataInclusao: new Date(), HoraInclusao: "", Mes01: false, Mes02: false, 
				Mes03: false, Mes04: false, Mes05: false, Mes06: false, Mes07: false, Mes08: false, Mes09: false, Mes10: false, Mes11: false, Mes12: false
			});
			
			return oModelUpd;
		},
		
		getServData: function (){
			var oModel = this.getOwnerComponent().getModel("FechamentoServ");
            var oFechModel = this.getView().getModel("oModelFechamento");
			var itemsCount = this.getView().byId('title');
            var that = this;
			
			//Leitura do Serviço
            oModel.read("/ZPSTA_CDS_FECHAMENTO", {
                success: async function (oData,) {
                    if(oData != null){
                        for (var i = 0; i < oData.results.length; i++) {
                            var oRow = oData.results[i];
                            for (var key in oRow) {
                                if (key.includes("mes_")) {
                                    oRow[key] = oRow[key] ? true : false;
                                }
                            }
                        }
                    }


                    if(oData != null){
                        var dataLength = oData.results.length;
                        oFechModel.setData(oData.results);
                        itemsCount.setText(`Items (${dataLength})`);
                    }
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
		},
		
		onAdd: function(){
			var that = this;
			
			
			if (!this.oDialogAdd) {
				this.oDialogAdd = Fragment.load({
					name: "portoseguro.zpstaparametros.view.dialogs.AddFechamento",
				    controller: this
				    });
				}
				this.oDialogAdd.then(function (oDialogAdd){
					that.getView().addDependent(oDialogAdd);  
					oDialogAdd.setModel(that.getView().getModel('oModelAdd'));
				    oDialogAdd.open();
				    }.bind(this));
		},
		
		onSave: function(oEvent){
            var oModel = this.getOwnerComponent().getModel();
            var myDialog = sap.ui.getCore().byId("idAddFechamento");
            var that = this;
			var oModelAdd = this.getView().getModel('oModelAdd');
			var oParams = oModelAdd.getData();		

			if(!oParams.HoraInclusao){
				MessageBox.error("Hora de Inclusão Inválida ou em branco");
				return;
			}
		
			oModel.setUseBatch(false);

			oModel.create("/OZPSTA_FECH_CONTABSet", oParams, {
				success: function (oData) {
					if(oData != null){
						
						MessageToast.show("Salvo com Sucesso!");
						oModel.setUseBatch(true);
						oModel.refresh();
						oModelAdd.refresh();
						myDialog.close();		
						that.busyDialog();
						that.onResetValueState();
					}
				},
				error: function (oError) {
					console.log(oError);
					if(oError.responseText){
						var oJsonResponseText =  JSON.parse(oError.responseText);

						MessageBox.error(oJsonResponseText.error.message.value)
					}
					
					oModel.setUseBatch(true);
					
				}
			});
			

			
		},	
		
		onDelMessage: function(){
			var idxLength = this.getView().byId('idFechamentoTable').getSelectedIndices().length;
			var infoMessage = `Nenhum registro foi selecionado!`;
			var dLabel = `Deseja confirmar a exclusão dos registros \n selecionados?`;
			var that = this;
						
			if(idxLength < 1){
				MessageToast.show(infoMessage, {duration: 800});
			}else{
				MessageBox.confirm(dLabel, {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if(sAction == MessageBox.Action.OK){
							if(idxLength != 0){
								that.onDelete();
							}
						}
					}
				});
			}
		},
		
		onDelete: function(oEvent){
			var oTable = this.getView().byId('idFechamentoTable');
			var selRowsIdx = oTable.getSelectedIndices();
			var oModel = this.getView().getModel();
			var that = this;
			var arrRowsWrp = [];

			oModel.setUseBatch(false);
			
			for(var i = 0; i < selRowsIdx.length; i++){              
				var sPath = oTable.getContextByIndex(selRowsIdx[i]).getPath();
                arrRowsWrp.push(sPath);
			}
			
            for(var i = 0; i < arrRowsWrp.length; i++){
                oModel.remove(arrRowsWrp[i], {
                    success: async function () {
                        MessageToast.show("Registro deletado com sucesso");
                        oTable.clearSelection();                       
						oModel.setUseBatch(true);
						oModel.refresh();
                    },
                    error: function (oError) {
                        console.log(oError);
						oModel.setUseBatch(true);
                        MessageToast.show("Erro ao deletar registro", {duration: 800});
                    }
                });
            }

            this.busyDialog();
		},
		
		onEdit: function(oEvent){
			var selRowsIdx = this.getView().byId('idFechamentoTable').getSelectedIndices();
			
			if(selRowsIdx.length === 1){
				this.getRowValue();
			}else if(selRowsIdx.length < 1){
				MessageToast.show("Nenhum registro selecionado");
			}else if(selRowsIdx.length > 1){
				MessageToast.show("Só é permitido atualizar registro por vez");
			}
		},
		
		getRowValue: function(){
			var oTable = this.getView().byId('idFechamentoTable'),
				selRowsIdx = oTable.getSelectedIndices(),			
				oModel = this.getView().getModel(),						 	
			 	oRow = oModel.getObject(oTable.getContextByIndex(selRowsIdx[0]).getPath());			 	
			
			this.getView().setModel( new JSONModel(oRow) , "oModelUpd");						
			this.onEditDialog(oRow);
		},
		
		onEditDialog: function(oRow){
			var that = this;
			if (!this.oDialog) {
				this.oDialog = Fragment.load({
					name: "portoseguro.zpstaparametros.view.dialogs.UpdFechamento",
				    controller: this
				    });
				
			}
			this.oDialog.then(function (oDialog){
				that.getView().addDependent(oDialog);  
				oDialog.setModel( new JSONModel(oRow) , "oModelUpd");
			    oDialog.open();
		    }.bind(this));

		},
		
		onEditSave: function(oEvent){
            var oModel = this.getOwnerComponent().getModel(),
			 	myDialog = sap.ui.getCore().byId("idUpdFechamento"),
			 	arrfechamento = this.getView().getModel('oModelUpd').getData(),
			 	date = sap.ui.getCore().byId('idDateUpd').getDateValue(),
             	oTable = this.getView().byId('idFechamentoTable'),
			 	selRowsIdx = oTable.getSelectedIndices(),
			 	sPath = oTable.getContextByIndex(selRowsIdx[0]).getPath(),
			 	currDay, currMonth, currYear, fullDateStr;     

            currDay = date.getDate();
            currMonth = date.getMonth() + 1;
            currYear = date.getFullYear();
            fullDateStr = new Date(`${currMonth} ${currDay} ${currYear}`);

			arrfechamento.DataInclusao = fullDateStr;           

			delete arrfechamento.__metadata;
			delete arrfechamento.HoraModif;
			delete arrfechamento.DataModif;
			delete arrfechamento.UsuarioModif;

			var bodyContent = arrfechamento;
			
			this.onValidate(oEvent);
			
			if(
				sap.ui.getCore().byId("idDateUpd").getValueState() === 'Success' &&
				sap.ui.getCore().byId("iptHrs_upd").getValueState() === 'Success'){
					
                    oModel.update(sPath, bodyContent, {
                        success: function (oData) {
							oTable.clearSelection();
                            MessageToast.show("Registro atualizado com sucesso");                            
							oModel.refresh();
                        },
                        error: function (oError) {
                            console.log(oError);							
                            MessageToast.show('Erro ao atualizar registro', {duration: 800});
                        }
                    });
				    myDialog.close();
				    this.busyDialog();

				}else{
					console.error('Erro ao salvar');
					MessageToast.show("Campo obrigatório vazio ou preenchido incorretamente");
					myDialog.close();
					this.onResetValueState();
				}
			
			
			
		},
		
		onValidate: function(oEvent){
			var sBtnSrc = oEvent.oSource.sId;
			
			if(sBtnSrc === 'savebtn'){
				onValSave();
			}
			if(sBtnSrc === 'savebtn_upd'){
				onValUpdate();
			}
			
			
			function onValSave(){
				var setSuccess = sap.ui.core.ValueState.Success;
				var setError = sap.ui.core.ValueState.Error;
				
				
				sap.ui.getCore().byId('iptEve').getProperty("value").length === 3 ? sap.ui.getCore().byId('iptEve').setValueState(setSuccess) : sap.ui.getCore().byId('iptEve').setValueState(setError);
				sap.ui.getCore().byId('iptAno').getProperty("value").length === 4 ? sap.ui.getCore().byId('iptAno').setValueState(setSuccess) : sap.ui.getCore().byId('iptAno').setValueState(setError);				
				var sDatePicker = sap.ui.getCore().byId("idDate");
				sDatePicker.getValue().length <= 10? sDatePicker.setValueState(setSuccess) : sDatePicker.setValueState(setError);
				
				var sTimePicker = sap.ui.getCore().byId("iptHrs");
				sTimePicker.getValue() === ''? sTimePicker.setValueState(setError) : sTimePicker.setValueState(setSuccess);
			}
			
			function onValUpdate(){
				var setSuccess = sap.ui.core.ValueState.Success;
				var setError = sap.ui.core.ValueState.Error;				
							
				var sDatePicker = sap.ui.getCore().byId("idDateUpd");
				sDatePicker.getValue().length <= 10? sDatePicker.setValueState(setSuccess) : sDatePicker.setValueState(setError);
				
				var sTimePicker = sap.ui.getCore().byId("iptHrs_upd");
				sTimePicker.getValue() === ''? sTimePicker.setValueState(setError) : sTimePicker.setValueState(setSuccess);
			}
		},
		
		busyDialog: function(){
			if(!oBusyDialog){
				var oBusyDialog = new sap.m.BusyDialog({});
				oBusyDialog.open();
			}
			setTimeout(function () {
				oBusyDialog.close();
			}, 1000)
		},
		
		onResetValueState: function (oEvent){
			var cancelBtnId;
			var arrCbId;
			var currView = this.getView();
			var arrIptId;
			
			if(oEvent != undefined){
				cancelBtnId = oEvent.mParameters.id;
			}
			else if(sap.ui.getCore().byId('idAddFechamento') != undefined){
				cancelBtnId = 'addCancel';
			}
			else if(sap.ui.getCore().byId('idUpdFechamento') != undefined){
				cancelBtnId = 'updCancel';
			}
			
			switch(cancelBtnId){
				case 'updCancel':
					arrIptId = ['iptEmp_upd', 'iptEve_upd', 'iptAno_upd', 'iptMes_upd', 'idDateUpd', 'iptHrs_upd'];
					arrCbId = ['updcb01','updcb02','updcb03','updcb04','updcb05','updcb06','updcb07','updcb08','updcb09','updcb10','updcb11','updcb12'];
					currView.byId('idFechamentoTable').clearSelection();
					break;
				case 'addCancel':
					arrIptId = ['iptEmp', 'iptEve', 'iptAno', 'iptMes', 'idDate', 'iptHrs'];
					arrCbId = ['cb01','cb02','cb03','cb04','cb05','cb06','cb07','cb08','cb09','cb10','cb11','cb12'];
					
				default:
					console.log('Id não encontrado!');
					break;
			}
			
			for(var i = 0; i < arrCbId.length; i++){
				sap.ui.getCore().byId(arrCbId[i]).setSelected(false);
			}

			
			for(var i = 0; i < arrIptId.length; i++){
				if(sap.ui.getCore().byId(arrIptId[i])){
					sap.ui.getCore().byId(arrIptId[i]).resetProperty('valueState');
				}
			}
		},
		
		onCancel: function(oEvent) {
			var cancelBtnId = oEvent.mParameters.id;
			var dialogId = '';
			var oModel = this.getOwnerComponent().getModel();
			
			switch(cancelBtnId){
				case 'updCancel':
					dialogId = "idUpdFechamento";
					break;
				case 'addCancel':
					dialogId = "idAddFechamento";
					break;
				default:
					console.log('Id não encontrado!');
					break;
			}
			var myDialog = sap.ui.getCore().byId(dialogId);
			myDialog.close();
			
			if(!cancelBtnId =='updCancel'){
				this.getView().setModel(this.createAddModel(), 'oModelAdd');
				this.onResetValueState(oEvent);
			}
			this.getView().byId("idFechamentoTable").clearSelection();			
			oModel.refresh();
		},
		
		onFilterDialog: function(){
				var that = this;
			if (!this.oDialogFil) {
				this.oDialogFil = Fragment.load({
					name: "portoseguro.zpstaparametros.view.dialogs.FilterFechamento",
				    controller: this
				    });
				}
				this.oDialogFil.then(function (oDialogFil){
					that.getView().addDependent(oDialogFil);  
				    oDialogFil.setModel(that.getView().getModel("FechIFRS17Serv"));
					oDialogFil.open();

				    }.bind(this));
				    
		},
		
		onFilter: function(){
			var oTable = this.byId('idFechamentoTable');
			var aFilter = [];
			var filDialog = sap.ui.getCore().byId('idFiltrosFechamento');
			var iptEmp = filDialog.getContent()[0].getSelectedKey();
			var iptEve = filDialog.getContent()[1].getValue();
			var iptAno = filDialog.getContent()[2].getValue();
			
			if(iptEmp == false && iptEve == false && iptAno == false){
				filDialog.close();
			}else{
				if(iptEmp != false){
					var empFilter = new sap.ui.model.Filter( "Empresa", sap.ui.model.FilterOperator.EQ, iptEmp);
					aFilter.push(empFilter);
				}
				
				if(iptEve != false){
					var eveFilter = new sap.ui.model.Filter( "CodEveNegocio", sap.ui.model.FilterOperator.EQ, iptEve);
					aFilter.push(eveFilter);
				}
				
				if(iptAno != false){
					var anoFilter = new sap.ui.model.Filter( "Ano", sap.ui.model.FilterOperator.EQ, iptAno);
					aFilter.push(anoFilter);
				}
			}
			
			oTable.getBinding("rows").filter(aFilter);	
				
			filDialog.close();
		},
		
		onFilterCancel: function(){
			var filDialog = sap.ui.getCore().byId('idFiltrosFechamento');
			filDialog.getContent()[0].setValue('');
			filDialog.getContent()[1].setValue('');
			filDialog.getContent()[2].setValue('');
			this.byId('idFechamentoTable').getBinding("rows").filter([]);
			filDialog.close();
			
		},
		
		onImport:function(){
			var fUBtn = this.byId('fileUploader');
			
			if(fUBtn.getVisible() != true){
				this.byId('fileUploader').setVisible(true);
				this.byId('importBtn').setIcon('sap-icon://decline');
			}else{
				this.byId('fileUploader').setVisible(false);
				this.byId('importBtn').setIcon('sap-icon://upload');
			}
			
		},
		
		onUpload: function(oEvent){
			var fileUploader = this.byId('fileUploader');
			var modelData = this.getView().getModel('oModelAdd');
			var fechamentoToken = this.getView().getModel().getSecurityToken();
			var that = this;
			
			if(fileUploader.getValue() == ''){
				MessageToast.show('Nenhum arquivo encontrado', {duration: 800});	
			}else{
				onProcessData(oEvent);
			}
			
			function onProcessData(oEvent){
				//	File reader
				var oFileToRead = oEvent.getParameters().files["0"];
				var oFileSource = oEvent.oSource;
				var reader = new FileReader();
				
				// Read file into memory as UTF-8
				reader.readAsText(oFileToRead);
				
				// Handle errors load
				reader.onload = loadHandler;
				reader.onerror = errorHandler;
				
				function loadHandler(event) {
					var csv = event.target.result;
					processData(csv);
				}
				
				function errorHandler(evt) {
					if(evt.target.error.name == "NotReadableError") {
						alert("Cannot read file !");
					}
				}
				
				//	Recupera valores IDSEC do arquivo CSV
				function processData(csv) {
					var allTextLines = csv.split(/\r\n|\n/);
					var lines = [];
					var arrBody = [];
					
					for (var i=1; i<allTextLines.length; i++) {
						var data = allTextLines[i].split(';');
						var tarr = [];
						for (var j=1; j<data.length; j++) {
							tarr.push(data[j]);
						}
						lines.push(tarr);
					}
					
					for(var i = 0; i < lines.length; i++){
						var objList = new Object();
						objList.empresa = lines[i][0];
						objList.cod_eve_negocio = lines[i][1];
						objList.ano = lines[i][2];;
						objList.mes = lines[i][3];;
						objList.data_inclusao = lines[i][4];;
						objList.hora_inclusao = lines[i][5];;
						objList.mes_01 = lines[i][6];;
						objList.mes_02 = lines[i][7];;
						objList.mes_03 = lines[i][8];;
						objList.mes_04 = lines[i][9];
						objList.mes_05 = lines[i][10];
						objList.mes_06 = lines[i][11];
						objList.mes_07 = lines[i][12];
						objList.mes_08 = lines[i][13];
						objList.mes_09 = lines[i][14];
						objList.mes_10 = lines[i][15];
						objList.mes_11 = lines[i][16];
						objList.mes_12 = lines[i][17];
						objList.usuario_criacao = lines[i][18];
						objList.data_criacao = lines[i][19];
						objList.usuario_modif = lines[i][20];
						objList.data_modif = lines[i][21];
						objList.hora_modif = lines[i][22];
							
						arrBody.push(objList);
					}
					
					//modelData.setData(lines);
					console.log(arrBody);
					
				
					
					var infoMessage = `Importação de arquivo cancelada!`;
					var dLabel = `Deseja confirmar a importação do arquivo?`;
								
					MessageBox.confirm(dLabel, {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if(sAction == MessageBox.Action.OK){
								// importarRegistro(arrBody);
							}else{
								MessageToast.show(infoMessage, {duration: 800});
								fileUploader.setValue(null);
							}
						}
					});
				}
				
				function importarRegistro(arrBody){
					var url = "/event_translator/fechamento_api?portalInterceptorAppId=psta_parametros2";
					var modelDataCont = modelData.getData();
					
					var bodyContent = {
							"acao": "New",
							"fechamento": []
					};
					
					for(var i =0; i < arrBody.length; i++){
						bodyContent.fechamento.push(arrBody[i])
					}
					
					console.log(bodyContent);
						
						fetch(url, {
							method: 'POST',
							headers: {
								"x-csrf-token": fechamentoToken,
								"Content-Type": "application/json"},
							body: JSON.stringify(bodyContent)
						})
						.then(response => {console.log(response)
							if(response.status !== 200){
								MessageToast.show('Erro ao salvar registro', {duration: 800});
							}
						})
					
					that.getView().setModel(that.createAddModel(), 'oModelAdd');
					MessageToast.show("Registro salvo com sucesso!", {duration: 800});
					fileUploader.setValue(null);
					that.getServData();
				}
			}
		},
		
		createColumnConfig: function() {
			var aCols = [];
			
			// aCols.push({label: 'mandt', property: 'mandt'});
			aCols.push({label: 'empresa', property: 'empresa'});
			aCols.push({label: 'cod_eve_negocio', property: 'cod_eve_negocio'});
			aCols.push({label: 'ano', property: 'ano'});
			aCols.push({label: 'mes', property: 'mes'});
			aCols.push({label: 'data_inclusao', property: 'data_inclusao'});
			aCols.push({label: 'hora_inclusao', property: 'hora_inclusao'});
			aCols.push({label: 'mes_01', property: 'mes_01'});
			aCols.push({label: 'mes_02', property: 'mes_02'});
			aCols.push({label: 'mes_03', property: 'mes_03'});
			aCols.push({label: 'mes_04', property: 'mes_04'});
			aCols.push({label: 'mes_05', property: 'mes_05'});
			aCols.push({label: 'mes_06', property: 'mes_06'});
			aCols.push({label: 'mes_07', property: 'mes_07'});
			aCols.push({label: 'mes_08', property: 'mes_08'});
			aCols.push({label: 'mes_09', property: 'mes_09'});
			aCols.push({label: 'mes_10', property: 'mes_10'});
			aCols.push({label: 'mes_11', property: 'mes_11'});
			aCols.push({label: 'mes_12', property: 'mes_12'});
			aCols.push({label: 'usuario_criacao', property: 'usuario_criacao'});
			aCols.push({label: 'data_criacao', property: 'data_criacao'});
			aCols.push({label: 'usuario_modif', property: 'usuario_modif'});
			aCols.push({label: 'data_modif', property: 'data_modif'});
			aCols.push({label: 'hora_modif', property: 'hora_modif'});

			return aCols;
		},

		
		onExport: function() {
			var aCols, oSettings, oSheet;
			var oTable = oTable = this.byId('idFechamentoTable');
			var oFechamentoModel = this.getView().getModel('oModelFechamento'); //oModelExport
			// var indices = oTable.getBinding('rows').oList;
			var indices = oFechamentoModel.oData;
			var aRows = [];
			aCols = this.createColumnConfig();

			for(var i = 0; i < indices.length; i++){
                var incObj = indices[i];
                for (var key in incObj) {
                    // if (key.includes("data_")) {
                    //     incObj[key] = incObj[key] ? incObj[key].toLocaleString().substr(0,10) : false;
                    // }

                    if (key.includes("hora_")) {

                        if(typeof(incObj[key]) != 'string'){
						var oHours = ''+Math.floor(incObj[key].ms/1000/60/60);
                        oHours = oHours.length < 2? '0'+oHours : oHours;
                        var oMinutes = ''+Math.floor((incObj[key].ms/1000/60/60 - oHours)*60);
                        oMinutes = oMinutes.length < 2? '0'+oMinutes : oMinutes;
                        var oSecounds = ''+Math.floor(((incObj[key].ms/1000/60/60 - oHours)*60 - oMinutes)*60);
                        oSecounds = oSecounds.length < 2? '0'+oSecounds : oSecounds;
                        var timeString = `${oHours}:${oMinutes}:${oSecounds}`;

                        incObj[key] = timeString;
						}
                    }
                    
                    if (key.includes("mes_")) {
						// incObj[key] = incObj[key] === true? 'X' : '';
						if(typeof(incObj[key]) !== 'string'){
							incObj[key] = incObj[key] === true? 'X' : '';
						}
                    }

					if (key.includes("data_")) {
						if(typeof(incObj[key]) != 'string'){
							incObj[key] = incObj[key] ? incObj[key].toLocaleString().substr(0,10) : false;

							let nDay = parseInt(incObj[key].substr(0,2))+1;
							let nMonth = incObj[key].substr(3,2);
							let nYear = incObj[key].substr(6);
							let mDate; 
							nDay < 10 ? mDate = `0${nDay}/${nMonth}/${nYear}` : mDate = `${nDay}/${nMonth}/${nYear}`;
							if(mDate.includes('32/12/')){
								nYear = parseInt(nYear)+1;
								mDate = `01/01/${nYear}`;
							}; 
							// return new Date(mDate);
							incObj[key] = mDate;
						}
                    }
                }

				aRows.push(incObj);
			}

			oSettings = {
				workbook: { columns: aCols, context: {sheetName: 'ZPSTA_FECHAMENTO'}},
				dataSource: aRows,
				fileName: `ZPSTA_FECHAMENTO.xlsx`
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('Sucesso ao exportar!');
				})
				.finally(oSheet.destroy);
		}
		
	});
});