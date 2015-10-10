/*
 * SirTrevorJS Image Block with a caption and float options
 * v0.1, 2015 Rense VanderHoek <rense@me.com>
 */

SirTrevor.Blocks.ImageWithCaptionAndFloat = SirTrevor.Blocks.Image.extend({

    type: "image_with_caption_and_float",

    title: function () {
        // return i18n.t('blocks:image:title');
        return "Image";
    },

    toolbarEnabled: true,
    droppable: true,
    uploadable: true,
    pastable: false,

    icon_name: 'image',

    loadData: function(data) {
        this.$editor.html($('<img>', {
            src: function () {
                if (!data.file[0]) {
                    return data.file.url
                }
                return data.file[0].url
            },
            width: 'auto' // overriding width: 100%
        })).show();

        if(data.float == null) {
            data.float = 'none';
        }
        this.$editor.append($('<label for="float">Float</label>'));
        ['left', 'none', 'right'].forEach(function(_float) {
            this.$editor.append(
                $('<input>', {
                    type: 'radio', name: 'float', value: _float,
                    class: 'st-img-float-' + _float,
                    checked: (data.float == _float ? true : false)
                })
            );
        }, this);

        this.$editor.append($('<label for="caption">Caption</label>'));
        this.$editor.append($('<input>', {
            type: 'text', name: 'caption', style: 'width: 95%;', value: data.caption
        }));
    },

    _serializeData: function() {
        var data = {};

        if(this.$(':input').not('.st-paste-block').length > 0) {
            this.$(':input').not('[type="radio"]').each(function(index, input) {
                if(input.name) {
                    data[input.name] = input.value;
                }
            });
            this.$(':input[type="radio"]').each(function(index, input) {
                if(input.checked) {
                    data[input.name] = input.value;
                }
            });
        }
        return data;
    },

    onBlockRender: function() {
        /* Setup the upload button */
        this.$inputs.find('button').bind('click', function(ev) {
            ev.preventDefault();
        });
        this.$inputs.find('input').on('change', (function(ev) {
            this.onDrop(ev.currentTarget);
        }).bind(this));
    },

    onDrop: function(transferData) {
        var file = transferData.files[0];
        urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

        if (/image/.test(file.type)) {
            this.loading();
            this.$inputs.hide();

            this.loadData({file: {url: urlAPI.createObjectURL(file)}});

            this.uploader(
                file,
                function(data) {
                    this.setData(data);
                    this.ready();
                },
                function(error) {
                    this.addMessage(i18n.t('blocks:image:upload_error'));
                    this.ready();
                }
            );
        }
    }
});