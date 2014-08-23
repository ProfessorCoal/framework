/*
 * 
 *  Blockstrap v0.5
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    // EMPTY OBJECT
    var security = {};
    
    // FUNCTIONS FOR OBJECT
    security.salt = function(modules, callback, salt)
    {
        if(!salt) salt = $.fn.blockstrap.settings.id;
        var keys = [];
        if($.isPlainObject(modules))
        {
            var count = 0;
            var key_count = Object.keys(modules).length;
            if(key_count === count)
            {
                callback(salt, keys);
            }
            else
            {
                $.each(modules, function(k, v)
                {
                    count++;
                    keys.push(k);

                    if($.isArray($.fn.blockstrap.settings.store))
                    {
                        $.each($.fn.blockstrap.settings.store, function(store_index, store_key)
                        {
                            if(store_key === k)
                            {
                                $.fn.blockstrap.data.save('keys', store_key, v, function()
                                {

                                });
                            }
                        });
                    }

                    salt = CryptoJS.SHA3(salt+k+blockstrap_functions.slug(v), { outputLength: 512 });
                    if(count >= key_count && callback)
                    {
                        callback(salt.toString(), keys);
                    }
                })
            }
        }
        else
        {
            callback(salt, keys);
        }
    }
    
    security.credentials = function(username, password, callback)
    {
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(login_status)
        {
            $.fn.blockstrap.core.modal('Warning', 'Credentials already exist');
        }
        else
        {
            var now = new Date().getTime();
            var salt = localStorage.getItem('nw_blockstrap_salt');
            if(salt)
            {
                var user = {
                    username: blockstrap_functions.slug(username),
                    password: CryptoJS.SHA3(salt+password, { outputLength: 512 }).toString(),
                    ts: now,
                    logged_in: false
                };
                localStorage.setItem('nw_blockstrap_login', JSON.stringify(user));
                if(callback) callback();
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Salt required before creating login credentials');
            }
        }
    }
    
    security.login = function(username, password, callback)
    {
        var now = new Date().getTime();
        var un = blockstrap_functions.slug(username);
        var salt = localStorage.getItem('nw_blockstrap_salt');
        var pw = CryptoJS.SHA3(salt+password, { outputLength: 512 }).toString();
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            if(login_status.username === un && login_status.password === pw)
            {
                if(login_status.logged_in !== true)
                {
                    login_status.ts = now;
                    login_status.logged_in = true;
                    localStorage.setItem('nw_blockstrap_login', JSON.stringify(login_status));
                }
                if(callback) callback();
            }
            else
            {
                $.fn.blockstrap.core.modal('Warning', 'Invalid Credentials');
            }
        }
        else
        {
            $.fn.blockstrap.core.modal('Error', 'Unacceptable Credentials');
        }
    }
    
    security.logout = function()
    {
        var now = new Date().getTime();
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            login_status.ts = now;
            login_status.logged_in = false;
            localStorage.setItem('nw_blockstrap_login', JSON.stringify(login_status));
            location.reload();
        }
    }
    
    security.logged_in = function()
    {
        var login_status = localStorage.getItem('nw_blockstrap_login');
        if(blockstrap_functions.json(login_status))
        {
            login_status = $.parseJSON(login_status);
            if(login_status.logged_in && login_status.logged_in === true) return true;
            else return false;
        }
        else
        {
            return true;
        }
    }
    
    security.verify = function()
    {
        
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {security:security});
})
(jQuery);


