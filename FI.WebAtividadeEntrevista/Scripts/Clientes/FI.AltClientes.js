function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';
    '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}   

function excluirBeneficiario(id) {
    if (confirm("Tem certeza que deseja excluir este beneficiário?")) {
        var row = $('#beneficiario-' + id);
        cpf = row.find('td.cpf input').val();
        $.ajax({
            url: '/Cliente/ExcluirBeneficiario', 
            method: 'POST',     
            data: {
                "CPF": cpf,                
                "IdCliente": $("#clienteId").val()
            }, 
            success: function (response) {                            
                $('#beneficiario-' + id).remove();
            },
            error: function (r) {
                console.error("Erro ao excluir o beneficiário: ", r);
                ModalDialog("Erro", "Não foi possível excluir o beneficiário.");
            }
        });
    }
}

function atualizarListaBeneficiarios(clienteId) {
    console.log("atualizarListaBeneficiarios");
    $.ajax({
        url: '/Cliente/ObterBeneficiarios',
        method: 'GET',
        data: { IdCliente: clienteId },
        success: function (beneficiarios) {
            var lista = $('#listaBeneficiarios');
            lista.empty();

            beneficiarios.forEach(function (beneficiario) {
                lista.append(
                    '<tr id="beneficiario-' + beneficiario.Id + '">' +
                    '<form id="form-' + beneficiario.Id + '" onsubmit="return false;">' +
                    '<td class="nome"><input type="text" class="form-control" value="' + beneficiario.Nome + '" disabled></td>' +
                    '<td class="cpf"><input type="text" class="form-control" value="' + beneficiario.CPF + '" disabled></td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-primary btn-sm" onclick="editarBeneficiario(' + beneficiario.Id + ')">Alterar</button> ' +
                    '<button type="button" class="btn btn-success btn-sm" style="display:none;" onclick="salvarBeneficiario(' + beneficiario.Id + ')">Salvar</button> ' +
                    '<button type="button" class="btn btn-secondary btn-sm" style="display:none;" onclick="cancelarEdicao(' + beneficiario.Id + ')">Cancelar</button> ' +
                    '<button type="button" class="btn btn-danger btn-sm" onclick="excluirBeneficiario(' + beneficiario.Id + ')">Excluir</button>' +
                    '</td>' +
                    '</form>' +
                    '</tr>'
                );
            });
        },
        error: function (r) {
            console.error("Erro ao obter a lista de beneficiários: ", r);
        }
    });
}
function cancelarEdicao(id) {
    var row = $('#beneficiario-' + id);
    // Desabilita os campos de entrada
    row.find('td > input').prop('disabled', true);
    // Esconde os botões "Salvar" e "Cancelar"
    row.find('.btn-success, .btn-secondary').hide();
    // Mostra o botão "Alterar"
    row.find('.btn-primary').show();
}
function editarBeneficiario(id) {
    console.log("editarbeneficiario");
    var row = $('#beneficiario-' + id);
    row.closest('form').attr('novalidate', 'novalidate');
    $('#beneficiario-' + id + ' >  td > input').prop('disabled', false);
    
    $('#beneficiario-' + id + ' .btn-success, #beneficiario-' + id + ' .btn-secondary').show();

    
}

function salvarBeneficiario(id) {    
    var nome = $('#beneficiario-' + id + ' .nome input').val();
    var cpf = $('#beneficiario-' + id + ' .cpf input').val();
    

    $.ajax({
        url: '/Cliente/AtualizarBeneficiario', // Substitua pela URL correta
        method: 'POST',
        data: {
            Id: id,
            Nome: nome,
            CPF: cpf
        },
        success: function (response) {            
            console.log(response);
            atualizarListaBeneficiarios($('#clienteId').val()); // Atualiza a lista após salvar
            ModalDialog("Sucesso!", response.message);
            //atualizarListaBeneficiarios(clienteId);
            if (response.status == 400) {
                ModalDialog("Ocorreu um erro", response.responseJSON);
            } else if (response.status == 500) {
                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            }
           

        },
        error: function (r) {
            console.error("Erro ao salvar o beneficiário: ", r);
            ModalDialog("Erro", "Não foi possível salvar as alterações.");
        }
    });
}




    $(document).ready(function () {   
        $('#CPF, #beneficiarioCpf').mask('000.000.000-00');

      

        if (obj) {
            $('#formCadastro #Nome').val(obj.Nome);
            $('#formCadastro #CEP').val(obj.CEP);
            $('#formCadastro #Email').val(obj.Email);
            $('#formCadastro #Sobrenome').val(obj.Sobrenome);
            $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
            $('#formCadastro #Estado').val(obj.Estado);
            $('#formCadastro #Cidade').val(obj.Cidade);
            $('#formCadastro #Logradouro').val(obj.Logradouro);
            $('#formCadastro #Telefone').val(obj.Telefone);
            $('#formCadastro #CPF').val(obj.CPF).trigger('input');
            $('#formCadastro #Id').val(obj.Id);
        }

        var cpf = $(this).find("#CPF").val();

        if (!validaCPF(cpf)) {
            ModalDialog("Erro", "CPF inválido!");
            return false;
        }

        //Para abrir o modal
        $('#btnBeneficiarios').click(function () {
            console.log("abrir modal")
            var clienteId = $('#formCadastro').find('#Id').val();
            $('#clienteId').val(clienteId);
            $('#beneficiariosModal').modal('show');
            atualizarListaBeneficiarios(clienteId);
        });


        $('#incluirBeneficiario').click(function (e) {
            e.preventDefault();
            var cpf = $("#beneficiarioCpf").val();
            var clienteId = $('#clienteId').val();

            if (!validaCPF(cpf)) {
                ModalDialog("Erro", "CPF inválido!");
                return false;
            }

            $.ajax({
                url: "/Cliente/IncluirBeneficiario",
                method: "POST",
                data: {
                    "CPF": $("#beneficiarioCpf").val(),
                    "Nome": $("#beneficiarioNome").val(),
                    "IdCliente": $("#Id").val()
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success: function (response) {   
                    ModalDialog("Sucesso!", response);
                    //atualizarListaBeneficiarios(clienteId);
                    if (response.status == 400) {
                            ModalDialog("Ocorreu um erro", response.responseJSON);
                    } else if (response.status == 500) {
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                        }
                    }
            });

        })


        $('#formCadastro').submit(function (e) {
            e.preventDefault();
            console.log($(this).find("#CPF").val());

            var cpf = $(this).find("#CPF").val();        
            $.ajax({
                url: urlPost,
                method: "POST",
                data: {
                    "NOME": $(this).find("#Nome").val(),
                    "CEP": $(this).find("#CEP").val(),
                    "Email": $(this).find("#Email").val(),
                    "Sobrenome": $(this).find("#Sobrenome").val(),
                    "Nacionalidade": $(this).find("#Nacionalidade").val(),
                    "Estado": $(this).find("#Estado").val(),
                    "Cidade": $(this).find("#Cidade").val(),
                    "Logradouro": $(this).find("#Logradouro").val(),
                    "Telefone": $(this).find("#Telefone").val(),
                    "CPF": cpf
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:

                function(r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                },

            });

        })

        function validaCPF(cpf) {
            console.log(cpf);
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf == '') return false;
            // Elimina CPFs inválidos conhecidos
            if (cpf.length != 11 ||
                cpf == "00000000000" ||
                cpf == "11111111111" ||
                cpf == "22222222222" ||
                cpf == "33333333333" ||
                cpf == "44444444444" ||
                cpf == "55555555555" ||
                cpf == "66666666666" ||
                cpf == "77777777777" ||
                cpf == "88888888888" ||
                cpf == "99999999999")
                return false;
            // Valida 1º dígito
            add = 0;
            for (i = 0; i < 9; i++)
                add += parseInt(cpf.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(9)))
                return false;
            // Valida 2º dígito
            add = 0;
            for (i = 0; i < 10; i++)
                add += parseInt(cpf.charAt(i)) * (11 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(10))) {
                return false;
            }
            return true;
        }

        
        
        //function atualizarListaBeneficiarios(clienteId) {

        //    console.log("atualizarListaBeneficiarios");
        //    $.ajax({
        //        url: '/Cliente/ObterBeneficiarios',
        //        method: 'GET',
        //        data: { IdCliente: clienteId },
        //        success: function (beneficiarios) {
        //            var lista = $('#listaBeneficiarios');
        //            lista.empty();

        //            beneficiarios.forEach(function (beneficiario) {
        //                lista.append(
        //                    '<tr id="beneficiario-' + beneficiario.Id + '">' +
        //                    '<td class="nome"><input type="text" class="form-control" value="' + beneficiario.Nome + '" disabled></td>' +
        //                    '<td class="cpf"><input type="text" class="form-control" value="' + beneficiario.CPF + '" disabled></td>' +
        //                    '<td>' +
        //                    '<button class="btn btn-primary btn-sm" onclick="editarBeneficiario(' + beneficiario.Id + ')">Alterar</button> ' +
        //                    '<button class="btn btn-success btn-sm" onclick="salvarBeneficiario(' + beneficiario.Id + ')">Salvar</button> ' +
        //                    '<button class="btn btn-danger btn-sm" onclick="excluirBeneficiario(' + beneficiario.Id + ')">Excluir</button>' +
        //                    '</td>' +
        //                    '</tr>'
        //                );
        //            });
        //        },
        //        error: function (r) {
        //            console.error("Erro ao obter a lista de beneficiários: ", r);
        //        }
        //    });




        //    function salvarBeneficiario(id) {
        //        var nome = $('#beneficiario-' + id + ' .nome input').val();
        //        var cpf = $('#beneficiario-' + id + ' .cpf input').val();

        //        $.ajax({
        //            url: 'SalvarBeneficiario', // Substitua pela URL correta
        //            method: 'POST',
        //            data: {
        //                Id: id,
        //                Nome: nome,
        //                CPF: cpf
        //            },
        //            success: function () {
        //                atualizarListaBeneficiarios(1); // Atualiza a lista após salvar
        //            },
        //            error: function (r) {
        //                console.error("Erro ao salvar o beneficiário: ", r);
        //            }
        //        });
        //    }

        //}

        

        

    });