    using FI.AtividadeEntrevista.BLL;
    using WebAtividadeEntrevista.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using FI.AtividadeEntrevista.DML;
    using System.Web.UI.WebControls;
using System.Reflection;

    namespace WebAtividadeEntrevista.Controllers
    {
        public class ClienteController : Controller
        {
            public ActionResult Index()
            {
                return View();
            }


            public ActionResult Incluir()
            {
                return View();
            }

        [HttpPost]
        public JsonResult ExcluirBeneficiario(FI.AtividadeEntrevista.DML.Beneficiario beneficiarios)
        {
            try
            {
                var beneficiario = new FI.AtividadeEntrevista.BLL.Beneficiario();
                var resultado = beneficiario.ExcluirBeneficiarios(beneficiarios);

                if (resultado == 1)
                {
                    return Json(new { status = "success", message = "Beneficiário excluído com sucesso!" });
                }
                else
                {
                    return Json(new { status = "error", message = "Não foi possível excluir o beneficiário. Verifique o ID e o CPF." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = "error", message = ex.Message });
            }
        }





        [HttpPost]
            public JsonResult Incluir(ClienteModel model)
            {
                BoCliente bo = new BoCliente();
            
                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }
                else
                {  
                    model.CPF = model.CPF.Replace(".", "").Replace("-", "");

                
                    if (bo.VerificarExistencia(model.CPF))
                    {
                        Response.StatusCode = 400;
                        return Json("O CPF já está cadastrado no sistema.");
                    }

                    model.Id = bo.Incluir(new Cliente()
                    {                    
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = model.CPF
                    });

           
                    return Json("Cadastro efetuado com sucesso");
                }
            }



            [HttpPost]
            public JsonResult IncluirBeneficiario(BeneficiarioModel model)
            {
                FI.AtividadeEntrevista.BLL.Beneficiario beneficiario = new FI.AtividadeEntrevista.BLL.Beneficiario();

                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }
                else
                {
                    //if (beneficiario.VerificarExistencia(model.CPF))
                    //{
                    //    Response.StatusCode = 400;
                    //    return Json("O CPF já está cadastrado no sistema.");
                    //}

                    model.CPF = model.CPF.Replace(".", "").Replace("-", "");

                    var resultado = beneficiario.Incluir(new FI.AtividadeEntrevista.DML.Beneficiario()
                    {
                        Nome = model.Nome,
                        CPF = model.CPF,
                        IdCliente = model.IdCliente

                    });

                    if (resultado == -1)
                    {
                        Response.StatusCode = 400;
                        return Json("Beneficiário com o mesmo CPF já existe para este cliente.");
                    }
                }

                return Json("Cadastro efetuado com sucesso");
            }

            [HttpGet]
            public JsonResult ObterBeneficiarios(long idCliente)
            {
                var beneficiarios =  new FI.AtividadeEntrevista.BLL.Beneficiario().ObterBeneficiarios(idCliente);
                var beneficiariosModel = beneficiarios.Select(b => new BeneficiarioModel
                {
                    Id = b.Id,
                    Nome = b.Nome,
                    CPF = b.CPF,
                    IdCliente = b.IdCliente
                }).ToList();

                return Json(beneficiariosModel, JsonRequestBehavior.AllowGet);
            }

            [HttpPost]
            public JsonResult AtualizarBeneficiario(FI.AtividadeEntrevista.DML.Beneficiario  beneficiario)
            {
                try
                {
                    var result = new FI.AtividadeEntrevista.BLL.Beneficiario().AtualizarBeneficiarios(beneficiario);

                    if(result == -1) 
                    {
                        return Json(new { status = "success", message = "Beneficiário já existente, cadastre outro." });
                    }
                    else
                    {
                        return Json(new { status = "success", message = "Beneficiário atualizado com sucesso!" });
                    }
                
                }
                catch (Exception ex)
                {
                    return Json(new { status = "error", message = ex.Message });
                }
            }


            [HttpPost]
            public JsonResult Alterar(ClienteModel model)   
            {
                BoCliente bo = new BoCliente();
       
                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }
                else
                {
                    model.CPF = model.CPF.Replace(".", "").Replace("-", "");


                    if (bo.VerificarExistencia(model.CPF))
                    {
                        Response.StatusCode = 400;
                        return Json("O CPF já está cadastrado no sistema.");
                    }

                    bo.Alterar(new Cliente()
                    {
                        Id = model.Id,
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = model.CPF
                    });
                               
                    return Json("Cadastro alterado com sucesso");
                }
            }

            [HttpGet]
            public ActionResult Alterar(long id)
            {
                BoCliente bo = new BoCliente();
                Cliente cliente = bo.Consultar(id);
                Models.ClienteModel model = null;

                if (cliente != null)
                {
                    model = new ClienteModel()
                    {
                        Id = cliente.Id,
                        CEP = cliente.CEP,
                        Cidade = cliente.Cidade,
                        Email = cliente.Email,
                        Estado = cliente.Estado,
                        Logradouro = cliente.Logradouro,
                        Nacionalidade = cliente.Nacionalidade,
                        Nome = cliente.Nome,
                        Sobrenome = cliente.Sobrenome,
                        Telefone = cliente.Telefone,
                        CPF = cliente.CPF
                    };

            
                }

                return View(model);
            }

            [HttpPost]
            public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
            {
                try
                {
                    int qtd = 0;
                    string campo = string.Empty;
                    string crescente = string.Empty;
                    string[] array = jtSorting.Split(' ');

                    if (array.Length > 0)
                        campo = array[0];

                    if (array.Length > 1)
                        crescente = array[1];

                    List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                    //Return result to jTable
                    return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
                }
                catch (Exception ex)
                {
                    return Json(new { Result = "ERROR", Message = ex.Message });
                }
            }
        }
    }