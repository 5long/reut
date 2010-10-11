TEST_FILES=`find test -name '*.js'`
NODE_PATH_ROOT=$(HOME)/.node_libraries

test-all:
	@@for FILE in $(TEST_FILES); do node $$FILE ; done

link: unlink
	@@mkdir -p $(NODE_PATH_ROOT)
	@@ln -s `pwd`/src $(NODE_PATH_ROOT)/reut

unlink:
	@@rm -f $(NODE_PATH_ROOT)/reut

.PHONY: test-all link unlink
