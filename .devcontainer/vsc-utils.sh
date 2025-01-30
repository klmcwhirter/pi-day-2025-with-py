
function echo_eval
{
    echo "$@"
    $@
}

function install_bin
{
    local bin_name=$1
    local tar_dir=$2
    local tar_url=$3
    local tar_file=$4
    local tar_has_internal_dir=$5

    echo $0: install_bin $@ ...

    if [ ! -h ~/.local/bin/${bin_name} ]
    then
        if [ ! -d ~/.local/bin -o ! -d ~/.local/share ]
        then
            echo_eval mkdir -p ~/.local/bin ~/.local/share
        fi

        echo_eval rm -f ~/.local/bin/${bin_name}

        echo_eval cd ~/.local/share

        if [ ! -d ${tar_dir} ]
        then
            if [ -f ${tar_file} ]
            then
                echo Reusing already retrieved tar file ...

                # NOP - fall through
            elif [ -f ${workdir}/${tar_file} ]
            then
                # This is common for nightly builds as the zig project limits the # of times a build can be d/l-ed per day.
                # I have learned to d/l a local copy and place it in the workspace dir and use it instead.

                echo Reusing local tar file ...
                echo_eval cp ${workdir}/${tar_file} ${tar_file}
            else
                echo Retrieving ${tar_file}
                echo_eval wget --quiet -O ${tar_file} ${tar_url}/${tar_file}
            fi

            if [ ${tar_has_internal_dir} -eq 1 ]
            then
                echo_eval tar xf ${tar_file}
                echo_eval rm ${tar_file}
            else
                echo_eval mkdir -p ${tar_dir}
                echo_eval tar x -C ${tar_dir} -f ${tar_file}
            fi
        fi

        echo_eval cd ../bin
        echo_eval ln -fs ../share/${tar_dir}/${bin_name} .
    else
        echo ${bin_name} already installed ...
    fi

    echo $0: install_bin $@ ... done
}
