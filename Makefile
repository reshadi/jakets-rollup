###################################################################################################
# setup jakets and basic tools
#

SEARCH_JAKETS__DIRS += ./node_modules/jakets
JAKETS__MAKEFILES = $(patsubst %,%/Makefile,$(SEARCH_JAKETS__DIRS))
JAKETS__MAKEFILE = $(word 1, $(wildcard $(JAKETS__MAKEFILES)))
ifeq ("$(JAKETS__MAKEFILE)","")
  JAKETS__MAKEFILE = $(lastword $(JAKETS__MAKEFILES))
  JAKETS__DIR = $(dir $(JAKETS__MAKEFILE))
  CURLOUT := $(shell curl https://raw.githubusercontent.com/reshadi/jakets/v6/Makefile --create-dirs -o $(JAKETS__MAKEFILE) )
  $(info $(CURLOUT))
endif
$(info JAKETS__DIR="$(dir $(JAKETS__MAKEFILE)" ))

JAKE_TASKS += debug release
LOG_LEVEL?=0
# EXPECTED_NODE_VERSION=v6.7.0
# NODE__DIR?=./build/nodejs
include $(JAKETS__MAKEFILE)

#
###################################################################################################


###################################################################################################
# optional custom rules
#

#
####################################################################################################
