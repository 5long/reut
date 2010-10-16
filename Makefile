.PHONY: test-all link unlink

TEST_FILES=`find test -name '*.js'`
NODE_PATH_ROOT=$(HOME)/.node_libraries
NAME=reut
FULL_PATH=$(NODE_PATH_ROOT)/$(NAME)

test-all:
	@@for FILE in $(TEST_FILES); do node $$FILE ; done

link: unlink
	@@mkdir -p $(NODE_PATH_ROOT)
	@@ln -s $(PWD)/src $(FULL_PATH)

unlink:
	@@rm -f $(FULL_PATH)
