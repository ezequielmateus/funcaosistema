using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;


namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
   
        internal long Incluir(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("IDCLIENTE", beneficiario.IdCliente),
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome),
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF)
            };

            var resultado = base.ExecutarScalar("FI_SP_AltBenef", parametros);

            int retorno;
            if (int.TryParse(resultado.ToString(), out retorno))
            {
                return retorno; 
            }
            else
            {
                throw new Exception("Erro ao executar a procedure FI_SP_AltBenef");
            }
        }

        internal int AtualizarBeneficiario(DML.Beneficiario beneficiario)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@Id", beneficiario.Id),
                new SqlParameter("@NOME", beneficiario.Nome),
                new SqlParameter("@CPF", beneficiario.CPF)
            };
            

            var resultado = base.ExecutarScalar("AtualizarBeneficiario", parametros);

            int retorno;
            if (int.TryParse(resultado.ToString(), out retorno))
            {
                return retorno;
            }
            else
            {
                throw new Exception("Erro ao executar a procedure FI_SP_AltBenef");
            }
        }


        internal List<DML.Beneficiario> ObterBeneficiarios(long idCliente)
        {
            List<DML.Beneficiario> beneficiarios = new List<DML.Beneficiario>();

            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("IDCLIENTE", idCliente)
            };

            using (var ds = base.Consultar("ObterBeneficiarios", parametros))
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    beneficiarios.Add(new DML.Beneficiario
                    {
                        Id = Convert.ToInt64(row["ID"]),
                        Nome = row["NOME"].ToString(),
                        CPF = row["CPF"].ToString(),
                        IdCliente = Convert.ToString(row["IDCLIENTE"])
                    });
                }
            }

            return beneficiarios;
        }








        internal int ExcluirBeneficiarios(DML.Beneficiario beneficiario)
        {
            
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@IdCliente", beneficiario.IdCliente),
                new SqlParameter("@CPF", beneficiario.CPF),

            };

            var resultado = base.ExecutarScalar("ExcluirBeneficiario", parametros);

            if (int.TryParse(resultado.ToString(), out int retorno))
            {
                return retorno;
            }
            else
            {
                throw new Exception("Erro ao executar a procedure ExcluirBeneficiario");
            }
        }
    }

}
