TEST_FILES=`find test -name '*.js'`

test-all:
	@@for FILE in $(TEST_FILES); do node $$FILE ; done

link:
	ln -s `pwd`/src ~/.node_libraries/reut

.PHONY: test-all link
