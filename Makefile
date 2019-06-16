##################################################################################################
# setup jakets and basic tools
#

SEARCH_JAKETS__DIRS += ./build/jakets-node

JAKETS__MAKEFILES = $(patsubst %,%/Makefile,$(SEARCH_JAKETS__DIRS))
JAKETS__MAKEFILE = $(word 1, $(wildcard $(JAKETS__MAKEFILES)))

ifeq ("$(JAKETS__MAKEFILE)","")
  JAKETS__MAKEFILE = $(lastword $(JAKETS__MAKEFILES))
  JAKETS__DIR = $(dir $(JAKETS__MAKEFILE))
  CMD_OUT += $(shell mkdir -p $(JAKETS__DIR) )
  CMD_OUT += $(shell wget -q -O - https://api.github.com/repos/reshadi/jakets/tarball/v7.x.x | tar xvz -C $(JAKETS__DIR) --strip-components=1 )
  $(info $(CMD_OUT))
endif
$(info JAKETS__DIR="$(dir $(JAKETS__MAKEFILE))")
$(info JAKETS__MAKEFILE="$(JAKETS__MAKEFILE)" )
$(info JAKETS__MAKEFILE="$(abspath $(JAKETS__MAKEFILE))")
$(info JAKETS__MAKEFILE="$(realpath $(JAKETS__MAKEFILE))")


JAKE_TASKS += test
LOG_LEVEL?=0
NODE__DIR?=./build/nodejs
include $(JAKETS__MAKEFILE)

#
###################################################################################################


###################################################################################################
# optional custom rules
#

#
####################################################################################################
