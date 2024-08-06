using FI.AtividadeEntrevista.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class Beneficiario
    {
        DAL.DaoBeneficiario objBeneficiario = new DAL.DaoBeneficiario();

        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Beneficiario beneficiario)
        {
            
            return objBeneficiario.Incluir(beneficiario);
        }

        public int AtualizarBeneficiarios(DML.Beneficiario beneficiario)
        {
             return objBeneficiario.AtualizarBeneficiario(beneficiario);
        }

        public int ExcluirBeneficiarios(DML.Beneficiario beneficiario)
        {
            return objBeneficiario.ExcluirBeneficiarios(beneficiario);
        }

        public List<DML.Beneficiario> ObterBeneficiarios(long idCliente)
        {
            return objBeneficiario.ObterBeneficiarios(idCliente);
        }

    }
}
