$(function() {

    var jcrop_api, boundx, boundy;

    function showPreview(coords){
        if(parseInt(coords.w) > 0){
            var rx = $("#preview_box").width() / coords.w;
            var ry = $("#preview_box").height() / coords.h;
            //通过比例值控制图片的样式与显示
            $("#crop_preview").css({
                width:Math.round(rx * $("#ImgPr").width()) + "px",
                height:Math.round(rx * $("#ImgPr").height()) + "px",
                marginLeft:"-" + Math.round(rx * coords.x) + "px",
                marginTop:"-" + Math.round(ry * coords.y) + "px"
            });
            $('#x').val(coords.x);
            $('#y').val(coords.y);
            $('#w').val(coords.w);
            $('#h').val(coords.h);
        }
    }

    jQuery.fn.extend({
        uploadPreview: function (opts) {
            var _self = this,
                _this = $(this);
            opts = jQuery.extend({
                Img: "ImgPr",
                Width: 100,
                Height: 100,
                ImgType: ["gif", "jpeg", "jpg", "bmp", "png"],
                upload:false,
                Callback: function () {
                    if (typeof jcrop_api !== 'undefined')
                        jcrop_api.destroy();
                    opts.upload = true;
                    if (opts.Img === 'ImgPr' ) {
                        $("#ImgPr").Jcrop({
                            minSize: [22, 22], // min crop size
                            bgFade: true, // use fade effect
                            bgOpacity: 3, // fade opacity
                            onChange: showPreview,
                            onSelect: showPreview,
                            aspectRatio: 1
                        },function(){
                            // Use the API to get the real image size
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                            // Store the API in the jcrop_api variable
                            jcrop_api = this;
                        });
                    }
                }
            }, opts || {});
            _self.getObjectURL = function (file) {
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file)
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file)
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file)
                }
                return url
            };
            _this.change(function () {
                if (this.value) {
                    if (!RegExp("\.(" + opts.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase()) ) {
                        alert("选择文件错误,图片类型必须是" + opts.ImgType.join("，") + "中的一种");
                        this.value = "";
                        return false
                    }
                    if ($.browser.msie) {
                        try {
                            $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))
                        } catch (e) {
                            var src = "";
                            var obj = $("#" + opts.Img);
                            var div = obj.parent("div")[0];
                            _self.select();
                            if (top != self) {
                                window.parent.document.body.focus()
                            } else {
                                _self.blur()
                            }
                            src = document.selection.createRange().text;
                            document.selection.empty();
                            obj.hide();
                            obj.parent("div").css({
                                'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)',
                                'width': opts.Width + 'px',
                                'height': opts.Height + 'px'
                            });
                            div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src
                        }
                        opts.Callback()
                    } else {
                        var img=null;
                        var img = new Image;
                        img.onload = function() {
                            if (opts.Img === "ImgPr") {
                                if (img.width > 300) {
                                    $("#" + opts.Img).hide();
                                    $("#unstyled-file").val('');
                                    alert("上传图片最大宽度为300");
                                    return false
                                }
                                if (img.height > 255) {
                                    $("#" + opts.Img).hide();
                                    $("#unstyled-file").val('');
                                    alert("上传图片最大长度为255");
                                    return false
                                }
                            }
                            opts.Callback();
                        };

                        if (opts.upload  === true) {
                            $("#" + opts.Img).hide();
                            $("#unstyled-file").val('');
                            alert("请刷新页面重新上传图片！");
                            return false
                        }else {
                            $("#" + opts.Img).show();
                            $("#" + opts.Img).attr('src', _self.getObjectURL(this.files[0]))

                        }
                        img.src = _self.getObjectURL(this.files[0]);
                    }

                }
            })
        }
    });

    $("#unstyled-file").uploadPreview({ Img: "crop_preview", Width: 22, Height: 22 });
    $("#unstyled-file").uploadPreview({ Img: "ImgPr", Width: 280, Height: 260 });

});